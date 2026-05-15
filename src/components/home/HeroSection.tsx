"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function HeroSection({ bannerUrl }: { bannerUrl: string }) {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] flex items-center justify-center md:justify-start overflow-hidden bg-gray-900">
      
      {/* ── Background Image ── */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_30%] md:bg-[center_top] transition-transform duration-1000 scale-100"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-black/20" />

      {/* ── Content Area ── */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex flex-col justify-start pt-12 md:justify-center md:pt-0 items-center md:items-start text-center md:text-left">
        
        {/* 🔥 Text Section: এর অ্যানিমেশন আলাদা করা হয়েছে */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl w-full flex flex-col items-center md:items-start"
        >
          {/* 🔥 Twille Exclusive - এখন সব স্ক্রিনেই Golden (#d4a843) কালার দেখাবে */}
          <div className="mb-2 md:mb-4">
            <span className="text-[#d4a843] text-[9px] md:text-xs font-bold tracking-[0.3em] uppercase drop-shadow-md">
              Twille Exclusive
            </span>
          </div>
          
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 md:mb-6 font-serif leading-[1.1] tracking-tight drop-shadow-lg">
            The Art of <br />
            <span className="italic">Modern Dressing</span>
          </h1>

          {/* Description (Only for Desktop) */}
          <p className="hidden md:block text-gray-200 text-base mb-10 font-light max-w-md leading-relaxed drop-shadow-md">
            Experience the perfect blend of traditional craftsmanship and modern aesthetics. Designed for those who appreciate the finer things.
          </p>
        </motion.div>

        {/* ── Buttons Section ── */}
        {/* 🔥 বাটনের অ্যানিমেশন আলাদা করা হয়েছে, এখন আর মোবাইলে বাজেভাবে লাফাবে না */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-10 left-0 right-0 flex flex-row items-center justify-center md:static md:justify-start gap-3 sm:gap-4 px-4 md:px-0"
        >
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 md:px-8 py-3.5 bg-white text-black text-[10px] md:text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#d4a843] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
          >
            Shop Now <ChevronRight size={14} />
          </Link>
          
          <Link
            href="/categories"
            className="w-full sm:w-auto px-6 md:px-8 py-3.5 bg-transparent border border-white/80 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-white hover:text-black transition-all duration-300 text-center backdrop-blur-sm"
          >
            Collections
          </Link>
        </motion.div>

      </div>
    </div>
  );
}