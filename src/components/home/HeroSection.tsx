"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function HeroSection({ bannerUrl }: { bannerUrl: string }) {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] flex items-end md:items-center overflow-hidden bg-gray-900">
      
      {/* ── Dynamic Background Image ── */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_top] transition-transform duration-1000 scale-100"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 pb-16 md:pb-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* 🔥 Mobile e hide, PC te show korar jonno 'hidden md:block' */}
          <div className="mb-4 hidden md:block">
            <span className="text-[#d4a843] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
              Twille Exclusive
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif leading-[1.1] tracking-tight hidden md:block">
            The Art of <br />
            <span className="italic">Modern Dressing</span>
          </h1>
          
          <p className="text-gray-200 text-sm md:text-base mb-10 font-light max-w-md mr-auto leading-relaxed hidden md:block">
            Experience the perfect blend of traditional craftsmanship and modern aesthetics. Designed for those who appreciate the finer things.
          </p>

          {/* 🔥 Button gulo sob screen e thakbe */}
          <div className="flex flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
            <Link
              href="/products"
              className="px-6 md:px-8 py-3 md:py-3.5 bg-white text-black text-[10px] md:text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#d4a843] hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              Shop Now <ChevronRight size={14} />
            </Link>
            
            <Link
              href="/categories"
              className="px-6 md:px-8 py-3 md:py-3.5 bg-transparent border border-white text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-white hover:text-black transition-all duration-300"
            >
              Collections
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}