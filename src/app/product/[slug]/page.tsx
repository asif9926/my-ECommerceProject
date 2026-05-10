"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner"; // নোটিফিকেশনের জন্য

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Zustand থেকে addItem ফাংশনটি আনা হলো
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
          setMainImage(data.product.images[0]?.url);
          if (data.product.variants?.length > 0) {
            setSelectedSize(data.product.variants[0].size);
            setSelectedColor(data.product.variants[0].color);
          }
        }
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    // কার্টে প্রোডাক্ট পাঠানোর ডেটা স্ট্রাকচার
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      image: mainImage,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });

    // সাকসেস নোটিফিকেশন দেখানো
    toast.success(`${quantity}x ${product.name} added to your cart!`, {
      style: { background: "#10b981", color: "#fff", border: "none" },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#d4a843] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-xl font-bold">Product Not Found</div>;

  const uniqueSizes = Array.from(new Set(product.variants?.map((v: any) => v.size).filter(Boolean)));
  const uniqueColors = Array.from(new Set(product.variants?.map((v: any) => v.color).filter(Boolean)));

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Home
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.category?.slug}`} className="hover:text-black transition-colors">
            {product.category?.name || "Shop"}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0">
              {product.images?.map((img: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img.url)}
                  className={`w-20 h-24 md:w-full md:h-32 rounded-sm overflow-hidden border-2 transition-colors ${mainImage === img.url ? 'border-[#d4a843]' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-grow relative aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              {product.discountPrice && (
                <div className="absolute top-4 left-4 bg-[#e74c3c] text-white text-xs font-bold px-3 py-1.5 rounded-sm tracking-wider">
                  SALE
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col pt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Syne'] mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-[#d4a843]">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-sm text-gray-500">(12 Reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-[#e74c3c]">৳{product.discountPrice}</span>
                  <span className="text-xl text-gray-400 line-through mb-1">৳{product.price}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">৳{product.price}</span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {uniqueSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-900">Size</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueSizes.map((size: any) => (
                    <button
                      key={size as string}
                      onClick={() => setSelectedSize(size as string)}
                      className={`w-12 h-12 flex items-center justify-center border rounded-sm font-medium transition-all ${
                        selectedSize === size 
                          ? 'border-gray-900 bg-gray-900 text-white' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-900'
                      }`}
                    >
                      {size as string}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {uniqueColors.length > 0 && (
              <div className="mb-8">
                <span className="font-medium text-gray-900 block mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color: any) => (
                    <button
                      key={color as string}
                      onClick={() => setSelectedColor(color as string)}
                      className={`px-4 py-2 border rounded-sm text-sm font-medium transition-all ${
                        selectedColor === color 
                          ? 'border-gray-900 text-gray-900 bg-gray-50' 
                          : 'border-gray-300 text-gray-500 hover:border-gray-900'
                      }`}
                    >
                      {color as string}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-600 hover:text-black transition-colors"
                >−</button>
                <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3 text-gray-600 hover:text-black transition-colors"
                >+</button>
              </div>
              
              {/* অ্যাড টু কার্ট বাটন */}
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-[#d4a843] hover:bg-[#c2983b] text-white font-bold py-3 px-6 rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              
              <button className="p-3 border border-gray-300 rounded-sm text-gray-600 hover:border-gray-900 hover:text-red-500 transition-all flex items-center justify-center">
                <Heart size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <Truck className="text-[#d4a843] shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Free Shipping</h4>
                  <p className="text-xs text-gray-500 mt-1">On all orders over ৳2000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-[#d4a843] shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Secure Payment</h4>
                  <p className="text-xs text-gray-500 mt-1">bKash, Nagad & Cards accepted</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}