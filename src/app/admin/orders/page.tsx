import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link"; // এটি ইমপোর্ট করা খুব জরুরি ছিল!

export default async function AdminOrdersPage() {
  await connectDB();
  
  const orders = await Order.find({}).sort({ createdAt: -1 });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 font-['Syne'] mb-8">Manage Orders</h1>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer Info</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg font-medium text-gray-900 mb-1">No orders yet</p>
                    <p>When customers place orders, they will appear here.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id.toString()} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">#{order._id.toString().slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.shippingInfo.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-sm">
                        {order.paymentMethod === 'cod' ? 'C.O.D' : order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">৳{order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* এখানেই Link ব্যবহার করে ডায়নামিক URL তৈরি করা হয়েছে */}
                        <Link 
                          href={`/admin/orders/${order._id.toString()}`} 
                          className="p-2 text-gray-400 hover:text-[#d4a843] transition-colors" 
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>

                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Order">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}