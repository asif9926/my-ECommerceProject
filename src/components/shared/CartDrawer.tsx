"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const rawCart = useCartStore((state: any) => state.items || state.cart);
  const cart = rawCart || []; 
  
  const removeItem = useCartStore((state: any) => state.removeItem || state.remove);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity || state.updateItemQuantity);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const subTotal = cart.reduce((total: number, item: any) => {
    const itemPrice = item.discountPrice || item.price || 0;
    return total + itemPrice * (item.quantity || 1);
  }, 0);

  const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";

  return (
    <>
      {/* ── BACKGROUND OVERLAY ── */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* ── CART DRAWER PANEL (Right Side Slide) ── */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[450px] h-full bg-white z-[100] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              Your Bag ({cart.length})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-sm transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* CART ITEMS (Scrollable Body) */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <ShoppingBag size={48} strokeWidth={1} className="text-gray-300" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your bag is empty</p>
              <button onClick={onClose} className="mt-4 text-[10px] font-bold text-black border-b border-black pb-1 hover:text-[#d4a843] hover:border-[#d4a843] uppercase tracking-[0.2em] transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item: any, index: number) => {
                const itemPrice = item.discountPrice || item.price;
                const uniqueKey = item.cartItemId || `${item._id}-${item.size}-${item.variant}-${index}`;
                
                // 🔥 FIX: Valid Image Check
                const imgSrc = (typeof item.image === "string" && item.image.trim() !== "") 
                  ? item.image 
                  : fallbackImage;
                
                return (
                  <div key={uniqueKey} className="flex gap-4 group">
                    {/* Image */}
                    <div className="w-24 h-32 bg-gray-50 rounded-sm overflow-hidden shrink-0 border border-gray-100">
                      <img 
                        src={imgSrc} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          {/* 🔥 লিংক সরানো হয়েছে */}
                          <span className="text-xs font-bold text-gray-900 uppercase tracking-wider line-clamp-2">
                            {item.name}
                          </span>
                          <button 
                            onClick={() => removeItem && removeItem(item._id, item.size, item.variant)} 
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        {/* Variants */}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          {item.size && item.size !== "Default" && <span>Size: {item.size}</span>}
                          {item.size && item.size !== "Default" && item.variant && item.variant !== "Default" && <span className="w-1 h-1 bg-gray-300 rounded-full" />}
                          {item.variant && item.variant !== "Default" && <span>Variant: {item.variant}</span>}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-sm h-8 w-24">
                          <button 
                            onClick={() => updateQuantity && updateQuantity(item._id, item.size, item.variant, Math.max(1, (item.quantity || 1) - 1))}
                            className="px-2.5 h-full text-gray-500 hover:text-black transition-colors"
                          >−</button>
                          <span className="flex-1 text-center font-bold text-[11px] text-gray-900">{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity && updateQuantity(item._id, item.size, item.variant, (item.quantity || 1) + 1)}
                            className="px-2.5 h-full text-gray-500 hover:text-black transition-colors"
                          >+</button>
                        </div>
                        <span className="text-sm font-black text-gray-900">৳{itemPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER (Checkout Area) */}
        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-lg font-black text-gray-900">৳{subTotal}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-6 uppercase tracking-wider">
              Shipping & taxes calculated at checkout.
            </p>
            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 h-14 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#d4a843] transition-colors shadow-lg"
            >
              Proceed to Checkout <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}