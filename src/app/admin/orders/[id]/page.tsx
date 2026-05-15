import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, CreditCard, CheckCircle2, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import PaymentVerifier from "@/components/admin/PaymentVerifier";
import PrintButton from "@/components/admin/PrintButton"; // <-- Client Component Import করা হলো

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = params.id;

  await connectDB();
  const orderDoc = await Order.findById(orderId).populate("user", "name email");

  if (!orderDoc) return notFound();

  // Plain Object-e convert kora holo
  const order = JSON.parse(JSON.stringify(orderDoc));

  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStep = statuses.indexOf(order.status);

  // Date formatting
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0 print:p-0">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2.5 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors shadow-sm text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-['Syne']">Order Details</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[10px] text-gray-500 font-mono">ID: #{order._id.toUpperCase()}</p>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <p className="text-[10px] text-gray-600 font-bold flex items-center gap-1 uppercase">
                <Calendar size={10} /> {orderDate} at {orderTime}
              </p>
            </div>
          </div>
        </div>
        
        {/* Client Component Button */}
        <PrintButton />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Journey Tracker */}
          <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm print:hidden">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">Order Journey</h3>
            <div className="flex justify-between relative">
              {statuses.map((step, idx) => (
                <div key={step} className="flex flex-col items-center relative z-10 w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    idx <= currentStep ? 'bg-[#d4a843] border-[#d4a843] text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {idx < currentStep ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                  </div>
                  <p className={`text-[9px] font-bold uppercase mt-3 tracking-tighter ${idx <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step}
                  </p>
                  {idx !== statuses.length - 1 && (
                    <div className={`absolute top-4 left-[50%] w-full h-[2px] -z-10 ${idx < currentStep ? 'bg-[#d4a843]' : 'bg-gray-100'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-2 font-bold text-gray-900">
                <Package size={18} className="text-[#d4a843]" /> Order Items
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex items-center gap-6">
                  <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Size: {item.size} | Variant: {item.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">৳{item.price} x {item.quantity}</p>
                    <p className="font-bold text-gray-900">৳{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50/50 p-6 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtotal</span>
                <span>৳{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? "FREE" : `৳${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-900 text-lg uppercase tracking-tight">Total</span>
                <span className="font-['Syne'] font-extrabold text-2xl text-gray-900">৳{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment Panel */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden print:hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-900 text-sm">
              <CreditCard size={16} className="text-[#d4a843]" /> Payment Management
            </div>
            <div className="p-6">
              <PaymentVerifier 
                orderId={order._id} 
                paymentInfo={order.paymentInfo} 
                paymentStatus={order.paymentStatus} 
              />
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 print:hidden">
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-[10px] tracking-widest text-gray-400">Update Status</h3>
            <OrderStatusUpdater orderId={order._id} currentStatus={order.status} />
          </div>

          {/* Shipping Info */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest text-gray-400">
              <MapPin size={14} /> Shipping To
            </h3>
            <p className="text-sm font-bold text-gray-900">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
            <p className="text-xs text-gray-900 font-bold mt-1">{order.shippingInfo.phone}</p>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed uppercase">
              {order.shippingInfo.address}, {order.shippingInfo.city} - {order.shippingInfo.postalCode}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}