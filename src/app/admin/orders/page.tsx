"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // <-- এটি অ্যাড করা হলো
import { CheckCircle, Clock, Eye, Search, X, Wallet, CreditCard, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// সার্চ লজিক হ্যান্ডেল করার জন্য আলাদা কম্পোনেন্ট (Next.js 15 Suspense requirements)
function OrdersListContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || ""; // URL থেকে 'search' প্যারামিটার নেওয়া হলো

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(urlSearch); // URL এর ভ্যালু দিয়ে ইনিশিয়ালাইজ করা হলো
  const [activeTab, setActiveTab] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  // URL সার্চ টার্ম আপডেট হলে স্টেট আপডেট করা
  useEffect(() => {
    if (urlSearch) setSearchTerm(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    let result = orders;
    if (activeTab !== "All") {
      result = result.filter((order: any) => order.status === activeTab);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((order: any) => {
        const orderId = order._id?.toLowerCase() || "";
        const phone = order.shippingInfo?.phone || "";
        const userId = typeof order.user === 'object' ? order.user?._id?.toString().toLowerCase() : order.user?.toString().toLowerCase();
        return orderId.includes(term) || phone.includes(term) || (userId && userId.includes(term));
      });
    }
    setFilteredOrders(result);
  }, [searchTerm, activeTab, orders]);

  const getOrderCount = (status: string) => {
    if (status === "All") return orders.length;
    return orders.filter((order: any) => order.status === status).length;
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium font-['Syne']">Loading Dashboard...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Syne'] tracking-tight">Order Management</h1>
        <div className="relative w-full sm:max-w-[400px] flex items-center">
          <Search className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID, Phone or User ID..." 
            className="w-full py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843] text-sm bg-white shadow-sm"
            style={{ paddingLeft: "42px", paddingRight: "36px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 text-gray-400 hover:text-red-500 p-1">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
        {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-[11px] font-bold transition-all border uppercase ${
              activeTab === tab ? "bg-[#d4a843] text-white border-[#d4a843]" : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {tab}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gray-100 text-gray-500">{getOrderCount(tab)}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] tracking-widest font-bold">
              <tr>
                <th className="px-8 py-5">Order Info</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Payment Method</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50/50">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900 text-lg">৳{order.totalPrice}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-2">#{order._id.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900">{order.shippingInfo?.firstName}</p>
                    {order.user && (
                      <div className="mt-2 text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border font-mono w-max">
                        UID: {typeof order.user === 'object' ? order.user._id : order.user}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold uppercase">{order.paymentInfo?.method === 'instant' ? order.paymentInfo.gateway : 'COD'}</span>
                  </td>
                  <td className="px-8 py-6 uppercase text-[10px] font-bold">{order.status}</td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/admin/orders/${order._id}`} className="p-2 border rounded-sm hover:bg-gray-100 inline-block"><Eye size={18} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// মেইন এক্সপোর্ট যা Suspense দিয়ে মোড়ানো
export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-['Syne']">Loading Orders...</div>}>
      <OrdersListContent />
    </Suspense>
  );
}