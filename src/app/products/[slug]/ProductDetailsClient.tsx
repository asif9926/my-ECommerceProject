"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { 
  ShoppingBag, Heart, Ruler, ChevronUp, ChevronDown, 
  Truck, RotateCcw, Star, Plus, Minus, ArrowRight, Check, ChevronRight, X
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlistStore";

interface Props {
  initialProduct: any;
  relatedProducts: any[];
  freeShippingLimit: number;
}

export default function ProductDetailsClient({ initialProduct, relatedProducts, freeShippingLimit }: Props) {
  const { data: session, status } = useSession();
  
  const [product, setProduct] = useState(initialProduct);
  const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000";
  
  const getImageUrl = (image: any) => {
    if (!image) return fallbackImage;
    return typeof image === 'object' && image.url ? image.url : image;
  };

  const [mainImage, setMainImage] = useState(getImageUrl(product.images?.[0] || product.image));
  const [selectedSize, setSelectedSize] = useState("");
  // 🔥 Variants State
  const [selectedVariant, setSelectedVariant] = useState("");
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const addItem = useCartStore((state: any) => state.addItem || state.addToCart || state.add);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isSaved = isInWishlist(product?._id);

  const handleAddToCart = () => {
    // Size Check
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    
    // 🔥 Variant Check
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant first!");
      return;
    }

    setIsAdding(true);
    addItem({ 
      id: product._id, name: product.name, price: product.discountPrice || product.price, 
      image: mainImage, 
      size: selectedSize || "Default", 
      variant: selectedVariant || "Default", // 🔥 Variant পাঠানো হচ্ছে
      quantity 
    });
    
    setTimeout(() => {
      setIsAdding(false);
      const variantText = selectedVariant ? ` / Variant: ${selectedVariant}` : '';
      const sizeText = selectedSize ? `Size: ${selectedSize}` : '';
      const combinedText = [sizeText, variantText].filter(Boolean).join(" ");
      
      toast.success("Added to your shopping bag", {
        description: `${quantity}x ${product.name} ${combinedText ? `(${combinedText})` : ''}`,
        icon: <Check className="text-emerald-500" size={18} />
      });
    }, 500);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please write a comment.");
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted successfully!");
        setComment(""); setRating(5); setIsReviewModalOpen(false);
        setProduct({ ...product, reviews: [data.review, ...(product.reviews || [])] });
      } else {
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (error) { toast.error("Network error. Please try again."); } 
    finally { setIsSubmittingReview(false); }
  };

  const currentPrice = product.discountPrice || product.price;
  const realReviews = product.reviews || [];
  const averageRating = realReviews.length > 0 
    ? (realReviews.reduce((acc: number, item: any) => item.rating + acc, 0) / realReviews.length).toFixed(1) : "0.0";
  const totalReviewsCount = realReviews.length;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 md:px-8 pt-10">
        
        {/* ── BREADCRUMB ── */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/products?category=${product.category?.name || product.category}`} className="hover:text-black transition-colors">
            {product.category?.name || product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* ── LEFT: IMAGE GALLERY ── */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            <div className="relative w-full aspect-[3/4] md:h-[85vh] bg-gray-50 rounded-sm overflow-hidden group">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              {product.discountPrice && (
                <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 shadow-lg">Sale</div>
              )}
            </div>
            <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0 md:w-24 shrink-0">
              {product.images?.map((img: any, i: number) => {
                const url = getImageUrl(img);
                return (
                  <button key={i} onClick={() => setMainImage(url)} className={`relative w-20 h-28 md:w-full md:h-32 bg-gray-50 border transition-all ${mainImage === url ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={url} className="w-full h-full object-cover object-top" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── RIGHT: PRODUCT INFO ── */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#d4a843] uppercase tracking-[0.2em] mb-3">
                <Star size={12} fill={totalReviewsCount > 0 ? "#d4a843" : "none"} className={totalReviewsCount > 0 ? "" : "text-gray-300"} /> 
                {totalReviewsCount > 0 ? `${averageRating} (${totalReviewsCount} Reviews)` : "No reviews yet"}
              </div>
              <h1 className="font-['Syne'] text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-[1.1] mb-6">{product.name}</h1>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-2xl font-black text-gray-900">৳{currentPrice}</span>
                {product.discountPrice && <span className="text-lg text-gray-400 line-through font-medium">৳{product.price}</span>}
              </div>
            </motion.div>

            {/* SIZES */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Select Size</span>
                  <Link href="/size-finder" className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-sm shadow-sm group">
                    <Ruler size={14} className="text-gray-500 group-hover:text-white transition-colors" /> Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((sizeObj: any, index: number) => {
                    const sizeName = typeof sizeObj === 'object' ? sizeObj.size || sizeObj.name : sizeObj;
                    const uniqueKey = typeof sizeObj === 'object' && sizeObj._id ? sizeObj._id : `${sizeName}-${index}`;
                    return (
                      <button key={uniqueKey} onClick={() => setSelectedSize(sizeName)} className={`h-12 min-w-[3.5rem] px-4 border text-[11px] font-bold uppercase tracking-widest transition-all ${selectedSize === sizeName ? "border-black bg-black text-white" : "border-gray-200 text-gray-600 hover:border-black hover:text-black"}`}>
                        {sizeName}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 🔥 VARIANTS SELECTION */}
            {product.variants && product.variants.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Select Variant</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variantName: string, index: number) => (
                    <button 
                      key={`var-${index}`} 
                      onClick={() => setSelectedVariant(variantName)} 
                      className={`h-12 px-5 border text-[11px] font-bold uppercase tracking-widest transition-all ${selectedVariant === variantName ? "border-black bg-black text-white" : "border-gray-200 text-gray-600 hover:border-black hover:text-black"}`}
                    >
                      {variantName}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── QUANTITY & ACTIONS ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="flex flex-col gap-4 mb-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-200 h-14 w-full sm:w-36 shrink-0 rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"><Minus size={16} /></button>
                  <span className="flex-1 text-center font-black text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"><Plus size={16} /></button>
                </div>
                <button onClick={handleAddToCart} disabled={isAdding || product.stock === 0} className={`w-full h-14 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-3 transition-all shadow-xl ${product.stock === 0 ? "bg-gray-300 cursor-not-allowed" : isAdding ? "bg-emerald-600" : "bg-black hover:bg-[#d4a843]"}`}>
                  {product.stock === 0 ? "Out of Stock" : isAdding ? <><Check size={18} /> Added</> : <><ShoppingBag size={18} strokeWidth={1.5} /> Add to Bag</>}
                </button>
              </div>
              <button onClick={() => { toggleWishlist(product); toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist"); }} className={`w-full h-14 border rounded-sm flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all group ${isSaved ? "border-red-500 text-red-500 bg-red-50" : "border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50"}`}>
                <Heart size={18} strokeWidth={1.5} className={`transition-colors ${isSaved ? "fill-red-500 text-red-500" : "group-hover:fill-red-500 group-hover:text-red-500"}`} /> 
                {isSaved ? "Saved in Wishlist" : "Add to Wishlist"}
              </button>
            </motion.div>

            {/* ACCORDIONS */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="border-t border-gray-100 mt-4">
              <div className="border-b border-gray-100">
                <button onClick={() => setOpenAccordion(openAccordion === "description" ? null : "description")} className="w-full py-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                  Product Details {openAccordion === "description" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === "description" ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium whitespace-pre-wrap">{product.description}</p>
                </div>
              </div>
              <div className="border-b border-gray-100">
                <button onClick={() => setOpenAccordion(openAccordion === "shipping" ? null : "shipping")} className="w-full py-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                  Shipping & Returns {openAccordion === "shipping" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === "shipping" ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="space-y-4 text-xs text-gray-500 font-medium">
                    <div className="flex items-start gap-3">
                      <Truck size={16} className="text-black shrink-0" /> 
                      <p>Standard Delivery: 2-4 business days.<br/>
                      <span className="text-[#d4a843] font-bold mt-1 block">
                        {freeShippingLimit > 0 ? `Free shipping on orders over ৳${freeShippingLimit}.` : 'Standard shipping rates apply.'}
                      </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3"><RotateCcw size={16} className="text-black shrink-0" /> Easy 7-day returns & exchange policy.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🔥 ── REAL REVIEWS SECTION ── */}
        <section className="mt-24 pt-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-['Syne'] text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black">{averageRating}</div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.round(Number(averageRating)) ? (totalReviewsCount > 0 ? "black" : "none") : "none"} className={s <= Math.round(Number(averageRating)) && totalReviewsCount > 0 ? "text-black" : "text-gray-300"} />)}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Based on {totalReviewsCount} reviews</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                if (status === "unauthenticated") {
                  toast.error("You must be logged in to leave a review.");
                  return;
                }
                setIsReviewModalOpen(true);
              }}
              className="h-12 px-8 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-sm"
            >
              Write a Review
            </button>
          </div>

          {realReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {realReviews.map((review: any, idx: number) => (
                <div key={review._id || idx} className="bg-gray-50 p-8 rounded-sm flex flex-col h-full border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-1">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "black" : "none"} className={s <= review.rating ? "text-black" : "text-gray-300"} />)}</div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2 line-clamp-1">{review.rating === 5 ? "Excellent!" : review.rating >= 3 ? "Good Product" : "Average"}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed flex-grow italic">"{review.comment}"</p>
                  <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-3">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                        {review.name ? review.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{review.name || "Verified Buyer"}</span>
                      <span className="text-[9px] font-bold text-[#d4a843] uppercase tracking-widest">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-sm">
              <Star size={32} className="mx-auto text-gray-300 mb-4" />
              <p className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">No Reviews Yet</p>
              <p className="text-xs text-gray-500">Be the first to share your thoughts on this piece.</p>
            </div>
          )}
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-20 border-t border-gray-100">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-['Syne'] text-2xl md:text-3xl font-black uppercase tracking-tighter">You May Also Like</h2>
              <Link href="/products" className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-[#d4a843] transition-colors">View All <ArrowRight size={14}/></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p: any) => (
                <Link key={p._id} href={`/products/${p.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-4 relative rounded-sm">
                    <img src={getImageUrl(p.images?.[0] || p.image)} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-1 line-clamp-1">{p.name}</h3>
                  <p className="text-xs font-black">৳{p.discountPrice || p.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg p-8 rounded-sm shadow-2xl relative"
            >
              <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
              <h3 className="font-['Syne'] text-2xl font-black uppercase tracking-tighter mb-6">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Rate the Product</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                        <Star size={28} fill={star <= rating ? "#000" : "none"} className={star <= rating ? "text-black" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Your Comment</label>
                  <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us what you think about this product..." className="w-full p-4 border border-gray-200 rounded-sm focus:border-black outline-none text-sm resize-none transition-colors" />
                </div>
                <button type="submit" disabled={isSubmittingReview} className="w-full h-12 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 hover:bg-[#d4a843] transition-colors">
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}