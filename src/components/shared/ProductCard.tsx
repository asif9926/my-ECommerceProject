"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore"; 
import { toast } from "sonner";

export default function ProductCard({ product }: { product: any }) {
  // Cart & Wishlist Stores
  const addToCart = useCartStore((state: any) => state.addItem || state.addToCart || state.add);
  const { toggleWishlist, isInWishlist } = useWishlistStore(); 
  
  const isSaved = isInWishlist(product._id);

  const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";

  // 🔥 FIX: Empty string strictly checked
  const getImageUrl = (imgData: any) => {
    if (!imgData) return null;
    if (typeof imgData === "string" && imgData.trim() !== "") return imgData;
    if (typeof imgData === "object" && imgData.url && imgData.url.trim() !== "") return imgData.url; 
    return null;
  };

  const image1 = getImageUrl(product.images?.[0]) || getImageUrl(product.image) || fallbackImage;
  const image2 = product.images?.length > 1 ? getImageUrl(product.images?.[1]) : null;

const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    addToCart({
      _id: product._id, // 🔥 FIX 1: Ekhane 'id' er bodole '_id' hobe
      name: product.name,
      slug: product.slug || product._id, // 🔥 FIX 2: slug add kora holo
      price: product.price, // 🔥 FIX 3: Base price
      discountPrice: product.discountPrice || product.salePrice, // 🔥 FIX 4: Discount price
      image: image1,
      quantity: 1,
      size: product.sizes?.[0]?.size || product.sizes?.[0] || "Default", 
      color: "Default" 
    });
    
    toast.success(`${product.name} added to cart!`);
  };




  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    toggleWishlist(product);
    toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist");
  };

  const displayPrice = product.discountPrice || product.salePrice;

  return (
    <div className="group relative flex flex-col cursor-pointer">
      
      {/* ── IMAGE CONTAINER ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4 rounded-sm">
        
        {displayPrice && (
          <div className="absolute top-3 left-3 z-10 bg-[#e74c3c] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
            Sale
          </div>
        )}
        
        <Link href={`/products/${product.slug || product._id}`}>
          <img 
            src={image1} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = fallbackImage; }}
          />
          {image2 && (
            <img 
              src={image2} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              onError={(e) => { e.currentTarget.src = fallbackImage; }}
            />
          )}
        </Link>

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-white/95 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-widest py-3.5 hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 rounded-sm shadow-lg z-10"
          >
            <ShoppingBag size={14} strokeWidth={1.5} /> Add To Cart
          </button>
          
          <button 
            onClick={handleWishlist}
            className="w-[42px] h-[42px] bg-white/95 backdrop-blur-sm text-black flex items-center justify-center hover:bg-[#d4a843] hover:text-white transition-colors rounded-sm shadow-lg shrink-0 z-10"
          >
            <Heart 
              size={16} 
              strokeWidth={1.5} 
              className={`transition-colors ${isSaved ? "fill-red-500 text-red-500" : ""}`} 
            />
          </button>
        </div>
      </div>

      {/* ── PRODUCT INFO (NOIR Style) ── */}
      <div className="flex flex-col gap-1.5 px-1">
        <span className="text-gray-400 text-[9px] uppercase tracking-[0.2em] font-medium">
          {typeof product.category === 'object' ? product.category?.name : (product.category || "Clothing")}
        </span>
        
        <Link href={`/products/${product.slug || product._id}`} className="text-xs font-bold text-gray-900 truncate hover:text-[#d4a843] transition-colors uppercase tracking-wider">
          {product.name}
        </Link>
        
        <div className="flex items-center gap-2 mt-0.5">
          {displayPrice ? (
            <>
              <span className="text-[#e74c3c] font-bold text-[13px]">৳{displayPrice}</span>
              <span className="text-gray-400 line-through text-[11px] font-medium">৳{product.price}</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold text-[13px]">৳{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}