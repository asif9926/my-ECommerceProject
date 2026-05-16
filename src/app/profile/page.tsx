"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Package, User, LogOut, CheckCircle2, Clock, Truck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Middleware এমনিতে প্রটেক্ট করবে, তারপরও ক্লায়েন্ট সাইড সেফটি
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" />
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  // Safe Total Calculation
  const totalSpent = orders.reduce((sum, order: any) => sum + (order.totalPrice || 0), 0);

  // Date Formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 md:py-12 font-['Inter']">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter font-['Syne']">My Account</h1>
          <p className="mt-1 text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">Welcome back to your dashboard</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* ─── SIDEBAR ─── */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm md:sticky md:top-24">
              <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 mx-auto shadow-sm">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={32} />
                )}
              </div>
              <h2 className="text-base md:text-lg font-bold text-center text-gray-900 mb-1">{session?.user?.name || "Premium Member"}</h2>
              <p className="text-[10px] md:text-[11px] text-gray-500 text-center mb-6 font-medium break-all">{session?.user?.email}</p>
              
              <div className="space-y-2 border-t border-gray-100 pt-6">
                <button className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 bg-black text-white text-[10px] md:text-[11px] uppercase tracking-widest font-bold rounded-sm transition-colors shadow-sm">
                  <Package size={16} /> My Orders
                </button>
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-red-500 hover:bg-red-50 text-[10px] md:text-[11px] uppercase tracking-widest font-bold rounded-sm transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* ─── MAIN CONTENT ─── */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-white border border-gray-100 rounded-sm p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</p>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-['Syne']">{orders.length}</h3>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center border border-gray-100 shrink-0">
                  <Package size={18} className="md:w-5 md:h-5" />
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-sm p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Spent</p>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-['Syne']">৳{totalSpent}</h3>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 shrink-0">
                  <CheckCircle2 size={18} className="md:w-5 md:h-5" />
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-widest">Order History</h3>
              </div>
              
              {orders.length === 0 ? (
                <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center">
                  <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mb-4" strokeWidth={1} />
                  <p className="text-xs md:text-sm text-gray-500 mb-6">You haven't placed any orders yet.</p>
                  <Link href="/products" className="bg-black hover:bg-[#d4a843] text-white text-[10px] md:text-[11px] uppercase tracking-widest font-bold px-6 py-3 rounded-sm transition-colors shadow-sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order: any) => (
                    <div key={order._id} className="p-4 md:p-6 hover:bg-gray-50/30 transition-colors">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Order ID: <span className="text-black ml-1">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-400 mt-1 font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-base md:text-lg font-bold text-gray-900 font-['Syne']">৳{order.totalPrice}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {order.paymentStatus === 'verified' ? (
                              <span className="inline-flex items-center gap-1 text-[8px] md:text-[9px] uppercase font-bold text-green-600 bg-green-50 px-2 py-1 rounded-sm border border-green-100 tracking-wider">
                                <CheckCircle2 size={10} /> Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[8px] md:text-[9px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-sm border border-orange-100 tracking-wider">
                                <Clock size={10} /> Unpaid
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[8px] md:text-[9px] uppercase font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-sm border border-gray-200 tracking-wider">
                              <Truck size={10} /> {order.status}
                           </span>
                          </div>
                        </div>
                      </div>

                      {/* 🔥 Order Items (Mobile Friendly & Includes Size/Variant) */}
                      <div className="flex flex-col gap-3 mt-4 md:mt-5 pt-4 md:pt-5 border-t border-gray-50">
                        {order.orderItems?.map((item: any, index: number) => {
                          const hasSize = item.size && item.size !== "Default";
                          const hasVariant = item.variant && item.variant !== "Default";
                          
                          return (
                            <div key={index} className="flex items-start gap-3 md:gap-4 bg-white border border-gray-100 p-3 rounded-sm shadow-sm relative group">
                              {/* Product Image */}
                              <div className="w-16 h-20 md:w-16 md:h-20 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                              </div>
                              
                              {/* Product Details */}
                              <div className="flex-1 flex flex-col justify-between py-0.5">
                                <p className="text-[10px] md:text-xs font-bold text-gray-900 line-clamp-2 uppercase leading-tight pr-4">
                                  {item.name}
                                </p>
                                
                                {/* Sizes and Variants Tags */}
                                <div className="flex flex-wrap items-center gap-2 mt-2 text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                  <span className="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-sm">Qty: {item.quantity}</span>
                                  {hasSize && <span className="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-sm">Size: {item.size}</span>}
                                  {hasVariant && <span className="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-sm text-[#d4a843]">{item.variant}</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}