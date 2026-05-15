"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  // Hydration Error এড়ানোর জন্য
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#d4a843] rounded-full animate-spin"></div>
      </div>
    );
  }

  // কার্ট খালি থাকলে এই ডিজাইনটি দেখাবে
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-400">
          <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 font-['Syne']">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our latest collections and find something you love.
        </p>
        <Link 
          href="/products" 
          className="px-8 py-3.5 bg-[#d4a843] hover:bg-[#c2983b] text-white font-semibold rounded-sm transition-colors shadow-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 2000 ? 0 : 120; // ২০০০ টাকার বেশি অর্ডারে ফ্রি শিপিং
  const total = subtotal + shipping;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10 font-['Syne']">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Side: Cart Items */}
          <div className="lg:w-2/3">
            <div className="border-t border-gray-200">
              {items.map((item) => (
                <div key={`${item._id}-${item.size}-${item.variant}`} className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-200 gap-6">
                  
                  {/* Product Image (🔥 লিংক সরিয়ে শুধু <div> করা হয়েছে) */}
                  <div className="w-24 h-32 shrink-0 bg-gray-100 rounded-sm overflow-hidden block">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Product Details (🔥 লিংক সরানো হয়েছে) */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                    
                    {/* Size & Variant */}
                    <div className="text-sm text-gray-500 mb-3 space-y-1">
                      {item.size && item.size !== "Default" && <p>Size: <span className="font-medium text-gray-700">{item.size}</span></p>}
                      {item.variant && item.variant !== "Default" && <p>Variant: <span className="font-medium text-gray-700">{item.variant}</span></p>}
                    </div>
                    <div className="font-semibold text-gray-900">
                      ৳{item.discountPrice || item.price}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-gray-300 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1), item.size, item.variant)}
                        className="px-3 py-1.5 text-gray-500 hover:text-black transition-colors"
                      ><Minus size={14} /></button>
                      
                      <span className="w-10 text-center font-medium text-sm text-gray-900">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1, item.size, item.variant)}
                        className="px-3 py-1.5 text-gray-500 hover:text-black transition-colors"
                      ><Plus size={14} /></button>
                    </div>
                    
                    <div className="text-right sm:w-24 font-bold text-gray-900">
                      ৳{(item.discountPrice || item.price) * item.quantity}
                    </div>

                    <button 
                      onClick={() => removeItem(item._id, item.size, item.variant)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Syne']">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? "Free" : `৳${shipping}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-end">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <div className="text-right">
                  <span className="font-bold text-2xl text-gray-900">৳{total}</span>
                  <p className="text-xs text-gray-500 mt-1">VAT included if applicable</p>
                </div>
              </div>

              <Link 
                href="/checkout" 
                className="w-full bg-[#d4a843] hover:bg-[#c2983b] text-white font-bold py-3.5 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                <ShieldCheck size={20} />
                <span className="text-xs font-medium uppercase tracking-wider">Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}