"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Package, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ইউজার লগইন করা না থাকলে লগইন পেজে পাঠিয়ে দেবে
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // লগইন করা থাকলে তার ইমেইল দিয়ে অর্ডারগুলো API থেকে আনবে
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/user/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#d4a843] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-['Syne']">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Side: Profile Info */}
          <div className="md:w-1/3">
            <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-[#d4a843]/10 rounded-full flex items-center justify-center text-[#d4a843]">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{session?.user?.name}</h2>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Package size={16} /> Total Orders</span>
                  <span className="font-bold text-gray-900">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><ShieldCheck size={16} /> Account Status</span>
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-sm text-xs">Verified</span>
                </div>
              </div>

              {/* অ্যাডমিন হলে ড্যাশবোর্ডে যাওয়ার বাটন দেখাবে */}
              {(session?.user as any)?.role === "admin" && (
                <Link href="/admin" className="mt-8 w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-sm flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                  Go to Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: Order History */}
          <div className="md:w-2/3">
            <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Clock size={20} className="text-[#d4a843]" /> Order History
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Package size={24} />
                  </div>
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Link href="/products" className="text-[#d4a843] hover:underline font-medium">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order: any) => (
                    <div key={order._id} className="border border-gray-100 rounded-sm p-5 hover:border-[#d4a843]/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          <p className="font-bold text-gray-900">৳{order.totalPrice}</p>
                          <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm text-center ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {order.orderItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 min-w-[200px]">
                            <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-gray-50 rounded-sm border border-gray-100" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
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