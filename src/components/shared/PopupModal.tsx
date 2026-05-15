"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<any>(null);

  useEffect(() => {
    // চেক করবে এই সেশনে ইউজার পপআপটি আগে দেখেছে কিনা 
    const hasSeenPopup = sessionStorage.getItem("hasSeenTwillePopup");
    
    // অ্যাডমিন প্যানেলের সেটিং ফেচ করা
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        
        // যদি অ্যাডমিন প্যানেল থেকে পপআপ অ্যাক্টিভ করা থাকে এবং ইউজার আগে না দেখে থাকে
        if (data.success && data.settings?.popup?.isActive && !hasSeenPopup) {
          setPopupData(data.settings.popup);
          setTimeout(() => setIsOpen(true), 1500);
        }
      } catch (error) {
        console.error("Popup fetch error:", error);
      }
    };

    fetchSettings();
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenTwillePopup", "true"); 
  };

  if (!popupData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* ── Background Overlay ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* ── Modal Content ── */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[800px] bg-[#f5efe6] rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden z-10"
          >
            {/* Close Button ('X') */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 z-20 bg-white/50 hover:bg-white rounded-full p-1.5 transition-colors"
            >
              <X size={20} className="text-gray-900" />
            </button>

            {/* Left: Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-200">
              <Image
                src={popupData.imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"}
                alt="Promo Banner"
                fill
                sizes="(max-width: 768px) 100vw, 50vw" /* 🔥 FIXED: এই লাইনটি যুক্ত করা হয়েছে ওয়ার্নিং সলভ করার জন্য */
                className="object-cover object-center"
              />
            </div>

            {/* Right: Text & Action Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-[#fdfbf7]">
              <h2 className="text-3xl md:text-4xl font-black font-['Syne'] tracking-tighter text-gray-900 mb-4 uppercase leading-tight">
                {popupData.title || "GET 50% OFF NOW"}
              </h2>
              <p className="text-sm text-gray-500 mb-8 font-medium">
                {popupData.description || "Don't miss out on our biggest sale. Grab your premium outfits before they're gone!"}
              </p>
              
              {/* Sale Action Button */}
              <Link
                href={popupData.link || "/products?sale=true"}
                onClick={closePopup}
                className="bg-[#d4a843] text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] w-full hover:bg-black transition-colors shadow-lg"
              >
                {popupData.buttonText || "SHOP SALE NOW"}
              </Link>
              
              {/* No Thanks Button */}
              <button 
                onClick={closePopup} 
                className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-black transition-colors"
              >
                NO, THANKS!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}