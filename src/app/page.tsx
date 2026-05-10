"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import ProductCard from "@/components/shared/ProductCard";


export default function HomePage() {

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* ── HERO SECTION ── */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Fashion Hero" 
            className="w-full h-full object-cover object-top"
          />
        </div>
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-widest text-white uppercase mb-6">
              New Arrival 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-['Syne'] tracking-tight drop-shadow-lg">
              Elevate Your <br />
              <span className="text-[#d4a843]">Everyday Style</span>
            </h1>
            <p className="text-gray-100 text-base md:text-lg max-w-2xl mx-auto mb-10 font-light drop-shadow-md">
              Discover our latest collection of premium clothing. Designed for comfort, tailored for confidence. Step into the new season with style.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/products" 
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold rounded-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                Shop Collection <ArrowRight size={18} />
              </Link>
              <Link 
                href="/categories" 
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white font-medium rounded-sm border border-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                View Lookbook
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY SECTION ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-['Syne'] mb-2">Shop by Category</h2>
              <p className="text-gray-500 text-sm">Find exactly what you're looking for</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-[#d4a843] hover:text-[#b58e35] font-medium transition-colors text-sm uppercase tracking-wider">
              All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Card 1: Men */}
            <Link href="/products?category=men" className="group relative h-[450px] overflow-hidden bg-gray-100 flex items-end p-8 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=987&auto=format&fit=crop" 
                alt="Men's Collection" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 w-full flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-['Syne']">Men</h3>
                  <p className="text-gray-300 text-sm">Explore Collection</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            {/* Category Card 2: Women */}
            <Link href="/products?category=women" className="group relative h-[450px] overflow-hidden bg-gray-100 flex items-end p-8 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                alt="Women's Collection" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 w-full flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-['Syne']">Women</h3>
                  <p className="text-gray-300 text-sm">Explore Collection</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            {/* Category Card 3: Accessories */}
            <Link href="/products?category=accessories" className="group relative h-[450px] overflow-hidden bg-gray-100 flex items-end p-8 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=987&auto=format&fit=crop" 
                alt="Accessories" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 w-full flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-['Syne']">Accessories</h3>
                  <p className="text-gray-300 text-sm">Finishing Touches</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* ── FEATURED PRODUCTS SECTION ── */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d4a843] text-sm font-semibold tracking-widest uppercase mb-2 block">Premium Quality</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Syne']">New Arrivals</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border border-gray-300 text-gray-900 font-medium rounded-sm hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>




    </div>
  );
}