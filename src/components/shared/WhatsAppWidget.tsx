"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation"; // 🔥 ১. এটি নতুন যুক্ত করা হলো

export default function WhatsAppWidget() {
  const pathname = usePathname(); // 🔥 ২. বর্তমান লিংকটি পড়ার জন্য
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 ৩. ম্যাজিক: যদি লিংকটি /admin দিয়ে শুরু হয়, তাহলে পুরো চ্যাট বক্স গায়েব!
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // 🔥 এখানে আপনার WhatsApp নাম্বারটি দেবেন (Country Code সহ, কিন্তু + ছাড়া)
  const whatsappNumber = "+8801754336668";

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // WhatsApp API URL তৈরি করা
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // নতুন ট্যাবে WhatsApp ওপেন করা
    window.open(whatsappUrl, "_blank");
    
    // মেসেজ সেন্ড করার পর বক্স ক্লিয়ার এবং ক্লোজ করে দেওয়া
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* ── CHAT BOX POPUP ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[320px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">Support Team</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Typically replies instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-5 bg-gray-50 h-40 overflow-y-auto">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <MessageCircle size={14} className="text-black" />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-gray-600 leading-relaxed">
                  Hi there! 👋 <br />
                  Need help with size, order, or anything else? Feel free to ask.
                </div>
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-black transition-colors"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shrink-0 hover:bg-[#d4a843] transition-colors disabled:opacity-50 disabled:hover:bg-black"
              >
                <Send size={14} strokeWidth={2} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING BUTTON ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#d4a843] transition-colors relative"
      >
        {isOpen ? (
          <X size={24} strokeWidth={1.5} />
        ) : (
          <MessageCircle size={24} strokeWidth={1.5} />
        )}
      </motion.button>
    </div>
  );
}