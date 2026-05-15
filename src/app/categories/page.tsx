"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// 🔥 Kids ক্যাটাগরি যুক্ত করা হয়েছে
const categories = [
  {
    name: "Men's Collection",
    slug: "men",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop",
    count: "Explore T-Shirts, Shirts, Panjabi & more"
  },
  {
    name: "Women's Fashion",
    slug: "women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    count: "Discover Kurtis, Sarees, Tops & more"
  },
  {
    name: "Premium Accessories",
    slug: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    count: "Watches, Wallets, Bags & Belts"
  },
  {
    name: "Kids Collection",
    slug: "kids",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop",
    count: "T-Shirts, Pants, Dresses, Toys & more"
  }
];

export default function CategoriesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Area */}
      <div className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black font-['Syne'] tracking-tighter uppercase"
          >
            Shop By <span className="text-[#d4a843]">Category</span>
          </motion.h1>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm tracking-widest uppercase font-medium">
            Find the perfect fit for your lifestyle
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-6 py-16">
        {/* 🔥 4টি আইটেমের জন্য 2x2 গ্রিড করা হয়েছে (md:grid-cols-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[450px] md:h-[500px] overflow-hidden bg-gray-100 rounded-sm"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end text-white">
                <h2 className="text-3xl font-black font-['Syne'] tracking-tight uppercase leading-none mb-3">
                  {cat.name}
                </h2>
                <p className="text-xs text-gray-200 uppercase tracking-widest font-medium mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {cat.count}
                </p>
                <Link 
                  href={`/products?category=${cat.slug}`}
                  className="w-fit flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black py-3.5 px-7 rounded-sm hover:bg-[#d4a843] hover:text-white transition-all shadow-lg"
                >
                  View Collection <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}