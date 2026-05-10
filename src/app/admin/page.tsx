import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { DollarSign, ShoppingBag, Users, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

// এটি একটি Server Component, তাই সরাসরি async ব্যবহার করা যাচ্ছে
export default async function AdminDashboard() {
  await connectDB();

  // ১. ডাটাবেস থেকে মোট অর্ডারের সংখ্যা আনা
  const totalOrders = await Order.countDocuments();

  // ২. মোট আয় (Revenue) হিসাব করা
  const revenueData = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  // ৩. মোট ইউনিক কাস্টমার হিসাব করা (ইমেইল দিয়ে)
  const uniqueCustomers = await Order.distinct("shippingInfo.email");
  const totalCustomers = uniqueCustomers.length;

  // ৪. একদম নতুন ৫টি অর্ডার লিস্ট আনা
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-['Syne']">Dashboard Overview</h1>
      
      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">৳{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalCustomers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#d4a843]/20 flex items-center justify-center text-[#b58e35]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">3.2%</h3>
          </div>
        </div>
      </div>

      {/* ── RECENT ORDERS TABLE ── */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#d4a843] hover:underline font-medium">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id.toString()} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">#{order._id.toString().slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                      <br />
                      <span className="text-xs text-gray-500">{order.shippingInfo.phone}</span>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold">৳{order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-[#d4a843] transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
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