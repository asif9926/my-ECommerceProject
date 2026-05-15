"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Package, Users, Eye, Wallet, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/admin/stats?t=${new Date().getTime()}`);
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center font-['Syne'] text-gray-500">Syncing Dashboard...</div>;

  const cards = [
    { title: "Total Revenue", value: `৳${stats?.totalRevenue || 0}`, icon: DollarSign, trend: "Gross", color: "text-[#d4a843]" },
    { title: "Received Payment", value: `৳${stats?.receivedPayment || 0}`, icon: Wallet, trend: "Paid", color: "text-emerald-600" },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, trend: "Orders", color: "text-blue-600" },
    { title: "Total Products", value: stats?.totalProducts || 0, icon: Package, trend: "Live", color: "text-indigo-600" },
    { title: "Today Visitors", value: stats?.todayVisitors || 0, icon: Eye, trend: "Daily", color: "text-purple-600" },
    { title: "Total Visitors", value: stats?.totalVisitors || 0, icon: Users, trend: "All Time", color: "text-orange-600" },
  ];

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-6 md:space-y-10 bg-[#fafafa] min-h-screen">
      
      {/* 🔥 এই সেকশনটি মোবাইল ফ্রেন্ডলি করা হয়েছে */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 font-['Syne'] tracking-tight">DASHBOARD OVERVIEW</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Manage your premium clothing brand performance.</p>
        </div>
        <Link href="/admin/products/new" className="w-full md:w-auto bg-black text-white px-6 py-3 rounded-sm text-xs font-bold tracking-widest hover:bg-gray-800 transition-all text-center block md:inline-block">
          ADD NEW PRODUCT
        </Link>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-5 md:p-7 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4 md:mb-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                <card.icon size={20} className={`md:w-6 md:h-6 ${card.color}`} />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-2 py-1 rounded-sm">{card.trend}</span>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{card.title}</p>
              <p className="text-2xl md:text-3xl font-black text-gray-900 mt-1 md:mt-2 font-mono">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── EXPANDED RECENT ORDERS ── */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-black text-gray-900 font-['Syne'] tracking-tight">RECENT TRANSACTIONS</h2>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1">Real-time order tracking and statuses</p>
          </div>
          <Link href="/admin/orders" className="text-[10px] md:text-[11px] font-black text-black hover:text-[#d4a843] flex items-center justify-center md:justify-end gap-2 transition-colors uppercase tracking-widest">
            View All Orders <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-gray-400 uppercase text-[9px] md:text-[10px] font-black tracking-[0.2em] border-b border-gray-100 bg-white">
                <th className="px-4 md:px-8 py-4">Order ID</th>
                <th className="px-4 md:px-8 py-4">Customer</th>
                <th className="px-4 md:px-8 py-4">Date & Time</th>
                <th className="px-4 md:px-8 py-4">Amount</th>
                <th className="px-4 md:px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 md:px-8 py-10 text-center text-gray-400 text-xs font-medium italic">No recent orders to display.</td>
                </tr>
              ) : (
                stats?.recentOrders?.map((order: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-bold text-gray-900 font-mono tracking-tight">{order.id}</td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <p className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide">{order.customer}</p>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs text-gray-500 font-medium uppercase">{order.date}</td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-sm md:text-base font-black text-gray-900 font-mono">{order.amount}</td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                      <span className={`inline-block px-2 md:px-3 py-1 rounded-sm text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${
                        order.status === 'Verified' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                        'text-gray-400 bg-gray-50 border-gray-200'
                      }`}>
                        {order.status}
                      </span>
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