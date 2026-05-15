"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-gray-50 p-10 md:p-12 rounded-sm border border-gray-100 shadow-xl flex flex-col items-center">
        
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-8 shadow-lg">
          <CheckCircle size={40} className="text-[#d4a843]" strokeWidth={1.5} />
        </div>
        
        <h1 className="font-['Syne'] text-3xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
          Order Confirmed
        </h1>
        
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
          Thank you for shopping with us! Your order has been successfully placed. We will contact you shortly to confirm your delivery details.
        </p>

        <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

        <Link 
          href="/products" 
          className="w-full flex items-center justify-center gap-3 h-14 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#d4a843] transition-colors shadow-md"
        >
          <ShoppingBag size={18} strokeWidth={1.5} /> Continue Shopping
        </Link>
        
        <Link 
          href="/profile" 
          className="w-full flex items-center justify-center gap-2 mt-4 text-[11px] font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
        >
          View My Orders <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}