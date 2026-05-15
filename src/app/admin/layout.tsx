"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link"; // 🔥 Link import kora holo

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden w-full">
      
      {/* Mobile Top Header (শুধুমাত্র মোবাইলে দেখাবে) */}
      <div className="md:hidden fixed top-0 w-full bg-[#141414] text-white z-50 px-4 py-4 flex justify-between items-center shadow-md">
        {/* 🔥 ekhane span er bodole Link add kora holo ebong nam TWILLE kora holo */}
        <Link href="/" className="font-['Syne'] font-bold text-xl tracking-widest text-[#e8e8e8] uppercase">
          TWILLE<span className="text-[#d4a843]">ADMIN</span>
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-[#d4a843]">
          {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Sidebar (মোবাইলে ড্রয়ার হিসেবে আসবে, পিসিতে ফিক্সড থাকবে) */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <AdminSidebar />
      </div>

      {/* Mobile Overlay (মেনু ওপেন থাকলে পেছনের ব্যাকগ্রাউন্ড কালো করবে) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full mt-16 md:mt-0 p-4 md:p-8 bg-gray-50">
        {children}
      </main>

    </div>
  );
}