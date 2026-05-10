import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater"; // নতুন কম্পোনেন্ট ইমপোর্ট করা হলো

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = params.id;

  await connectDB();
  const order = await Order.findById(orderId);

  if (!order) return notFound();

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-['Syne']">Order Details</h1>
          <p className="text-sm text-gray-500">Order ID: #{order._id.toString().toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Product List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-900">
              <Package size={20} className="text-[#d4a843]" /> Ordered Products
            </div>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex items-center gap-4">
                  <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">৳{item.price} x {item.quantity}</p>
                    <p className="font-bold text-gray-900 mt-1">৳{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Items Subtotal</span>
                <span>৳{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>৳{order.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Grand Total</span>
                <span>৳{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Customer, Shipping & Status Info */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-[#d4a843]" /> Customer
            </h3>
            <p className="text-sm font-medium text-gray-900">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
            <p className="text-sm text-gray-500 mt-1">{order.shippingInfo.email}</p>
            <p className="text-sm text-gray-500">{order.shippingInfo.phone}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#d4a843]" /> Shipping Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingInfo.address}<br />
              {order.shippingInfo.city} - {order.shippingInfo.postalCode}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-[#d4a843]" /> Payment & Status
            </h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 uppercase">{order.paymentMethod}</span>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-sm ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {order.isPaid ? 'PAID' : 'UNPAID'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Current Status:</span>
              <span className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm ${
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-green-100 text-green-700'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Status Updater Component */}
            <OrderStatusUpdater orderId={orderId} currentStatus={order.status} />

          </div>
        </div>

      </div>
    </div>
  );
}