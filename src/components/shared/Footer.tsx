"use client";

import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle
} from "lucide-react";

// 🔥 Shop Links Array (Smartly Linked)
const shopLinks = [
  { name: "New Arrivals", href: "/products?sort=newest" },
  { name: "Best Sellers", href: "/products?featured=true" },
  { name: "Men's Collection", href: "/products?category=men" },
  { name: "Women's Collection", href: "/products?category=women" },
  { name: "Accessories", href: "/products?category=accessories" },
];

// 🔥 Support Links Array
const supportLinks = [
  { name: "Order Tracking", href: "/profile" },
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Terms & Conditions", href: "/terms-conditions" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { 
    name: "Contact Us", 
    href: "https://wa.me/8801754336668?text=Hello%20Twille,%20I%20need%20some%20help", // 👈 Brand WhatsApp
    external: true 
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* ── TOP SECTION: FEATURES ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/5 mb-12">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#d4a843] group-hover:border-[#d4a843] transition-all duration-300">
              <Truck size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-200">Fast Delivery</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Inside &amp; Outside Dhaka</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#d4a843] group-hover:border-[#d4a843] transition-all duration-300">
              <ShieldCheck size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-200">Secure Payment</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">100% Secure Checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#d4a843] group-hover:border-[#d4a843] transition-all duration-300">
              <RotateCcw size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-200">7 Days Return</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Easy exchange policy</p>
            </div>
          </div>
        </div>

        {/* ── MAIN FOOTER CONTENT ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Identity & Social Links */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black tracking-[0.3em] uppercase text-white hover:text-[#d4a843] transition-colors">
              Twille
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
              Redefining contemporary fashion with a touch of elegance. Discover curated collections designed for the modern lifestyle.
            </p>
            <div className="flex items-center gap-4">
              {/* 🔥 Facebook Link */}
              <a 
                href="https://www.facebook.com/twilleofficial" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#d4a843] hover:border-[#d4a843] transition-all duration-300 rounded-sm group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              
              {/* 🔥 Instagram Link */}
              <a 
                href="https://www.instagram.com/twille.official" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#d4a843] hover:border-[#d4a843] transition-all duration-300 rounded-sm group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">Shop</h4>
            <ul className="space-y-4">
              {shopLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 text-sm hover:text-[#d4a843] hover:translate-x-1 transition-all duration-300 inline-block font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">Customer Care</h4>
            <ul className="space-y-4">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="text-gray-400 text-sm hover:text-[#d4a843] hover:translate-x-1 transition-all duration-300 inline-block font-light">
                      {item.name}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-gray-400 text-sm hover:text-[#d4a843] hover:translate-x-1 transition-all duration-300 inline-block font-light">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">Contact Info</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-light">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#d4a843] shrink-0 mt-0.5" />
                <span>Khilkhet, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#d4a843] shrink-0" />
                <span>+880 1754-336668</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#d4a843] shrink-0" />
                <span>imtiazzaman02@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} <span className="text-white font-bold">Twille</span>. All Rights Reserved.
          </p>
          
          {/* Developed by Section with Message Icon */}
          <div className="flex items-center">
            <a 
              href="https://wa.me/8801710256453?text=Hello%20Asif,%20I%20saw%20your%20development%20work%20on%20Twille..." 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 group transition-all"
            >
              <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#d4a843] transition-colors">
                Developed by Asif
              </span>
              <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#d4a843] transition-all duration-300">
                <MessageCircle size={14} className="text-gray-500 group-hover:text-white" />
              </div>
            </a>
          </div>

          {/* 🔥 Payment Gateways (3 Items with Twille Secure Payment Title) */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Twille Secure Payment</span>
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white px-2.5 py-1.5 rounded-sm flex items-center justify-center">
                <img src="https://mohammadalinijhoom.com/wp-content/uploads/2024/07/bKash-Logo-300x300.png" alt="bKash" className="h-4 w-auto object-contain" />
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-sm flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/bn/thumb/9/97/%E0%A6%A8%E0%A6%97%E0%A6%A6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg/1920px-%E0%A6%A8%E0%A6%97%E0%A6%A6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg.png" alt="Nagad" className="h-4 w-auto object-contain" />
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-sm flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1920px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-4 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;