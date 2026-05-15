"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore((state: any) => state.addItem || state.addToCart || state.add);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMoveToCart = (product: any) => {
    // ডিফল্ট সাইজ দিয়ে কার্টে অ্যাড করা
    const sizeToUse = product.sizes && product.sizes.length > 0 
      ? (typeof product.sizes[0] === 'object' ? product.sizes[0].size : product.sizes[0]) 
      : "Default";

    addToCart({ 
      id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0]?.url || product.image,
      size: sizeToUse, 
      quantity: 1 
    });
    
    removeFromWishlist(product._id);
    toast.success("Moved to shopping bag!");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Heart size={64} strokeWidth={1} className="text-gray-200 mb-6" />
        <h1 className="font-['Syne'] text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Your Wishlist is Empty</h1>
        <p className="text-sm text-gray-500 font-medium mb-8">Save your favorite pieces here to review them later.</p>
        <Link href="/products" className="px-8 py-3.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#d4a843] transition-all shadow-md flex items-center gap-2">
          Discover Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-12 border-b border-gray-100 pb-6 flex items-end justify-between">
          <div>
            <h1 className="font-['Syne'] text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">Wishlist</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{items.length} {items.length === 1 ? 'Item' : 'Items'} Saved</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((product: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={product._id} 
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-sm mb-4">
                <img 
                  src={product.images?.[0]?.url || product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Remove Button */}
                <button 
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex flex-col flex-grow">
                <Link href={`/products/${product.slug || product._id}`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 line-clamp-1 hover:text-[#d4a843] transition-colors">{product.name}</h3>
                </Link>
                <p className="text-sm font-black mb-4">৳{product.discountPrice || product.price}</p>
                
                <button 
                  onClick={() => handleMoveToCart(product)}
                  className="mt-auto w-full py-3 border border-black text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all rounded-sm"
                >
                  <ShoppingBag size={14} /> Move to Bag
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}