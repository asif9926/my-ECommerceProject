"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Heart, Moon, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Zustand থেকে কার্টের টোটাল আইটেম সংখ্যা নিয়ে আসা
  const totalItems = useCartStore((state) => state.getTotalItems());

  // ইউজারের লগইন স্ট্যাটাস চেক করা হচ্ছে
  const { data: session } = useSession();

  // Hydration Error এড়ানোর জন্য component মাউন্ট হওয়ার পর ডেটা শো করা
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="bg-[#0d0d0d] text-white text-[10px] sm:text-xs font-medium tracking-widest uppercase py-2.5 px-4 text-center">
        Free shipping on orders over ৳2000 | Use code <span className="text-[#d4a843] font-bold">WELCOME10</span> for 10% off
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex h-16 items-center justify-between">
            
            <Link href="/" className="font-['Syne'] text-2xl font-bold tracking-tighter text-black">
              BRAND<span className="text-[#d4a843]">NAME</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
              <Link href="/" className="text-black transition-colors">NEW IN</Link>
              <Link href="/products?category=women" className="hover:text-black transition-colors">WOMEN</Link>
              <Link href="/products?category=men" className="hover:text-black transition-colors">MEN</Link>
              <Link href="/categories" className="hover:text-black transition-colors">ACCESSORIES</Link>
              <Link href="/products?sale=true" className="text-[#e74c3c] font-semibold hover:text-[#c0392b] transition-colors">SALE</Link>
            </nav>

            <div className="flex items-center gap-4 sm:gap-5 text-gray-800">
              <button className="hover:text-[#d4a843] transition-colors" title="Search">
                <Search size={20} strokeWidth={1.5} />
              </button>
              
              <Link href="/wishlist" className="hidden sm:block hover:text-[#d4a843] transition-colors" title="Wishlist">
                <Heart size={20} strokeWidth={1.5} />
              </Link>

              {/* ডায়নামিক ইউজার মেনু (লগইন করা থাকলে নাম দেখাবে) */}
              {session ? (
                <div className="relative group hidden sm:block">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-[#d4a843] transition-colors">
                    <span className="text-sm font-bold uppercase tracking-wider">{session.user?.name?.split(" ")[0]}</span>
                  </div>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2 pb-2">
                    {/* যদি ইউজার অ্যাডমিন হয়, তাহলে ড্যাশবোর্ডের লিংক দেখাবে */}
                    {(session.user as any)?.role === "admin" && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d4a843]">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d4a843]">
                      <User size={16} /> My Profile
                    </Link>
                    <button 
                      onClick={() => signOut()} 
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block hover:text-[#d4a843] transition-colors" title="Account">
                  <User size={20} strokeWidth={1.5} />
                </Link>
              )}

              <Link href="/cart" className="relative hover:text-[#d4a843] transition-colors" title="Cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {/* ডায়নামিক কার্ট কাউন্টার */}
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4a843] text-[9px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button 
                className="md:hidden hover:text-[#d4a843] transition-colors ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* মোবাইল মেনু */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-lg">
            <Link href="/" className="block text-gray-600 hover:text-black font-medium">NEW IN</Link>
            <Link href="/products?category=women" className="block text-gray-600 hover:text-black font-medium">WOMEN</Link>
            <Link href="/products?category=men" className="block text-gray-600 hover:text-black font-medium">MEN</Link>
            <Link href="/products?sale=true" className="block text-[#e74c3c] font-semibold">SALE</Link>
            <div className="border-t border-gray-100 pt-4 flex gap-6">
              <Link href="/wishlist" className="text-gray-600 hover:text-black"><Heart size={20} /></Link>
              
              {/* মোবাইলের জন্যও লগইন স্ট্যাটাস চেক */}
              {session ? (
                <button onClick={() => signOut()} className="text-red-600 hover:text-red-800"><LogOut size={20} /></button>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-black"><User size={20} /></Link>
              )}
              
            </div>
          </div>
        )}
      </header>
    </>
  );
}