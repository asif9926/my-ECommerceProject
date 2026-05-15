"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

const subCategoriesMap: Record<string, string[]> = {
  "Men": ["T-Shirt", "Shirt", "Polo", "Jeans", "Panjabi", "Hoodie", "Jacket", "Jersey"],
  "Women": ["T-Shirt", "Kurti", "Saree", "Tops", "Leggings", "3-Piece", "Gown", "Jersey"],
  "Accessories": ["Watch", "Wallet", "Bag", "Belt", "Cap", "Sunglasses"],
  "Kids": ["T-Shirt", "Pant", "Dress", "Toys", "Jersey"]
};

// মূল লজিকটি একটি আলাদা কম্পোনেন্টে রাখা হলো
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subCategory");
  const searchQueryParam = searchParams.get("q"); 
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // 🔥 সর্টিং এর জন্য স্টেট

  const categories = ["All", "Men", "Women", "Kids", "Accessories"];

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, subCategoryParam, searchQueryParam, sortBy]); // 🔥 sortBy অ্যাড করা হলো

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      
      if (data.success) {
        let filteredData = data.products;
        
        if (categoryParam && categoryParam.toLowerCase() !== "all") {
          filteredData = filteredData.filter((p: any) => {
            const catName = typeof p.category === 'object' ? p.category?.name : p.category;
            return catName?.toLowerCase() === categoryParam.toLowerCase();
          });
        }
        
        if (subCategoryParam) {
          filteredData = filteredData.filter((p: any) => 
            p.subCategory?.toLowerCase() === subCategoryParam.toLowerCase()
          );
        }

        if (searchQueryParam) {
          filteredData = filteredData.filter((p: any) => {
            const searchLower = searchQueryParam.toLowerCase();
            return (
              p.name?.toLowerCase().includes(searchLower) || 
              p.description?.toLowerCase().includes(searchLower)
            );
          });
        }

        // 🔥 সর্টিং লজিক ইমপ্লিমেন্ট করা হলো
        if (sortBy === "price-low") {
          filteredData.sort((a: any, b: any) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        } else if (sortBy === "price-high") {
          filteredData.sort((a: any, b: any) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        } else {
          // Newest (ডিফল্ট)
          filteredData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        setProducts(filteredData);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat: string) => {
    if (cat === "All") {
      router.push("/products");
    } else {
      router.push(`/products?category=${cat}`);
    }
    setIsMobileFilterOpen(false);
  };

  const handleSubCategoryClick = (cat: string, sub: string) => {
    router.push(`/products?category=${cat}&subCategory=${sub}`);
    setIsMobileFilterOpen(false);
  };

  const activeCategory = categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) : "All";

  return (
    <div className="bg-white min-h-screen">
      {/* ── HEADER AREA ── */}
      <div className="bg-gray-50 py-12 md:py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">{activeCategory}</span>
            {subCategoryParam && (
              <>
                <ChevronRight size={12} />
                <span className="text-gray-900">{subCategoryParam}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-['Syne'] tracking-tighter uppercase text-gray-900">
            {searchQueryParam ? (
              <>Search Results for <span className="text-[#d4a843] font-serif italic font-normal text-3xl md:text-5xl">"{searchQueryParam}"</span></>
            ) : (
              <>
                {subCategoryParam ? subCategoryParam : activeCategory} <span className="text-[#d4a843] font-serif italic font-normal text-3xl md:text-5xl">Collection</span>
              </>
            )}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-7xl flex flex-col md:flex-row gap-10">
        {/* ── DESKTOP SIDEBAR FILTER ── */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 border-b border-gray-100 pb-4">Categories</h3>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat}>
                  <button 
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeCategory === cat ? "text-[#d4a843]" : "text-gray-500 hover:text-black"}`}
                  >
                    {cat}
                  </button>
                  {activeCategory === cat && subCategoriesMap[cat] && (
                    <div className="flex flex-col gap-3 mt-4 ml-3 border-l-2 border-gray-100 pl-4">
                      {subCategoriesMap[cat].map(sub => (
                        <button 
                          key={sub}
                          onClick={() => handleSubCategoryClick(cat, sub)}
                          className={`text-[10px] font-bold uppercase tracking-widest text-left transition-colors ${subCategoryParam === sub ? "text-black" : "text-gray-400 hover:text-[#d4a843]"}`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE FILTER BUTTON ── */}
        <div className="md:hidden flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{products.length} Items</span>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black px-4 py-2 rounded-sm"
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div className="flex-1">
          <div className="hidden md:flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{products.length} Items</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Sort By:</span>
              {/* 🔥 সর্টিং ড্রপডাউন ফাংশনাল করা হলো */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[10px] text-black font-bold uppercase tracking-[0.2em] bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 animate-pulse">
               {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="aspect-[3/4] bg-gray-100 rounded-sm"></div>)}
             </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 border border-gray-100 rounded-sm">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">No pieces found in this collection.</p>
              <button onClick={() => router.push("/products")} className="text-[10px] text-black border-b border-black font-black uppercase tracking-[0.2em] pb-1 hover:text-[#d4a843] hover:border-[#d4a843] transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${isMobileFilterOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMobileFilterOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[80%] bg-white shadow-2xl transition-transform duration-300 transform ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Filters</span>
            <button onClick={() => setIsMobileFilterOpen(false)}><X size={20} className="text-gray-400 hover:text-black" /></button>
          </div>
          <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-6">
              {categories.map((cat) => (
                <div key={cat}>
                  <button 
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-xs font-bold uppercase tracking-widest ${activeCategory === cat ? "text-[#d4a843]" : "text-gray-900"}`}
                  >
                    {cat}
                  </button>
                  {activeCategory === cat && subCategoriesMap[cat] && (
                    <div className="flex flex-col gap-4 mt-4 ml-4 border-l-2 border-gray-100 pl-4">
                      {subCategoriesMap[cat].map(sub => (
                        <button 
                          key={sub}
                          onClick={() => handleSubCategoryClick(cat, sub)}
                          className={`text-[11px] font-bold uppercase tracking-widest text-left ${subCategoryParam === sub ? "text-black" : "text-gray-500"}`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔥 Suspense দিয়ে র‍্যাপ করা হলো (Next.js Build Error ফিক্স)
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#d4a843] rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}