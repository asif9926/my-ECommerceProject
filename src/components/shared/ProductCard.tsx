import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="group flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm mb-4">
        <img
          src={product.images[0]?.url || "https://via.placeholder.com/400x500"}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Sale Badge */}
        {product.discountPrice && (
          <div className="absolute top-3 left-3 bg-[#e74c3c] text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider">
            SALE
          </div>
        )}
        
        {/* Hover Add to Cart Button */}
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-md text-black font-semibold py-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 hover:bg-white shadow-sm">
          <ShoppingBag size={18} /> Quick Add
        </button>
      </Link>
      
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-[#d4a843] transition-colors text-sm">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-gray-500 text-xs mt-1">{product.category?.name}</p>
        </div>
        <div className="text-right text-sm">
          {product.discountPrice ? (
            <div className="flex flex-col items-end">
              <span className="font-semibold text-[#e74c3c]">৳{product.discountPrice}</span>
              <span className="text-gray-400 line-through text-xs">৳{product.price}</span>
            </div>
          ) : (
            <span className="font-semibold text-gray-900">৳{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}