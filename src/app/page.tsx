import Link from "next/link";
import { ArrowRight, Star, Quote } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import HeroSection from "@/components/home/HeroSection";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Settings from "@/models/Settings";

export const revalidate = 60;

// 🔥 Smart Logic: Shob product theke best 3ti review khuje ana
async function getTopReviews() {
  try {
    await connectDB();
    const result = await Product.aggregate([
      { $unwind: "$reviews" }, 
      { $match: { "reviews.rating": { $gte: 4 } } }, 
      { $sort: { "reviews.createdAt": -1 } }, 
      { $limit: 3 }, // 🔥 shudhu 3 ta review ashbe
      {
        $project: {
          _id: 0,
          name: "$reviews.name",
          rating: "$reviews.rating",
          comment: "$reviews.comment",
          avatar: "$reviews.avatar",
          productName: "$name", // 🔥 product er nam
          productSlug: "$slug" // 🔥 product er link
        }
      }
    ]);
    return result;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

async function getHeroBanner() {
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    // @ts-ignore
    if (settings && settings.heroBanners && settings.heroBanners.length > 0) {
       return settings.heroBanners[0].url;
    }
    return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";
  } catch (error) {
    return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";
  }
}

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true })
      .populate({ path: "category", model: Category, select: "name" }) 
      .sort({ createdAt: -1 })
      .limit(12) // 🔥 এখানে 8 এর বদলে 12 করে দেওয়া হয়েছে
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, bannerUrl, topReviews] = await Promise.all([
    getFeaturedProducts(),
    getHeroBanner(),
    getTopReviews()
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      <HeroSection bannerUrl={bannerUrl} />

      {/* ── PREMIUM CATEGORY SECTION (Smart Mobile Fix) ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[#d4a843] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase block mb-2 md:mb-3">
                Curated Selections
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-serif leading-[1.1] tracking-tight">
                Shop by Category
              </h2>
            </div>
            <Link 
              href="/categories" 
              className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-black hover:text-[#d4a843] transition-colors border-b border-black hover:border-[#d4a843] pb-1"
            >
              View All Collections <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 md:gap-4 h-auto lg:h-[600px]">
            {/* WOMEN */}
            <Link href="/products?category=women" className="group relative overflow-hidden bg-gray-100 rounded-sm col-span-2 lg:col-span-2 lg:row-span-2 h-[260px] md:h-[400px] lg:h-full">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Women" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end">
                <span className="text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Explore Collection</span>
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-wide">Women</h3>
              </div>
            </Link>

            {/* MEN */}
            <Link href="/products?category=men" className="group relative overflow-hidden bg-gray-100 rounded-sm col-span-2 lg:col-span-2 lg:row-span-1 h-[200px] md:h-[300px] lg:h-full">
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=987&auto=format&fit=crop" alt="Men" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 object-top" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end">
                <span className="text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Explore Collection</span>
                <h3 className="text-xl md:text-3xl font-serif font-bold text-white tracking-wide">Men</h3>
              </div>
            </Link>

            {/* KIDS */}
            <Link href="/products?category=kids" className="group relative overflow-hidden bg-gray-100 rounded-sm col-span-1 h-[180px] md:h-[300px] lg:h-full">
              <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop" alt="Kids" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <span className="text-white/80 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Explore</span>
                <h3 className="text-lg md:text-2xl font-serif font-bold text-white tracking-wide">Kids</h3>
              </div>
            </Link>

            {/* ACCESSORIES */}
            <Link href="/products?category=accessories" className="group relative overflow-hidden bg-gray-100 rounded-sm col-span-1 h-[180px] md:h-[300px] lg:h-full">
              <img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=987&auto=format&fit=crop" alt="Accessories" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <span className="text-white/80 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Touches</span>
                <h3 className="text-lg md:text-2xl font-serif font-bold text-white tracking-wide">Accessories</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
            <div>
              <span className="text-[#d4a843] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase block mb-2 md:mb-3">New Arrivals</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-serif leading-[1.1] tracking-tight">Latest Additions</h2>
            </div>
            <Link href="/products" className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-black hover:text-[#d4a843] transition-colors border-b border-black hover:border-[#d4a843] pb-1">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {featuredProducts.length === 0 ? (
               <p className="col-span-full text-center text-gray-500 py-10 font-medium text-sm md:text-base">No featured products found. Please add some from admin panel.</p>
            ) : (
              featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 🔥 CUSTOMER REVIEWS SECTION ── */}
      <section className="py-20 md:py-32 bg-white overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 text-center mb-16">
          <span className="text-[#d4a843] text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Voices of Twille</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight">Customer Satisfaction</h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topReviews.length > 0 ? topReviews.map((review: any, idx: number) => (
              <div key={idx} className="bg-gray-50 p-8 md:p-10 rounded-sm border border-gray-200 flex flex-col relative group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <Quote size={40} className="absolute top-6 right-6 text-gray-200 group-hover:text-[#d4a843]/20 transition-colors" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "#d4a843" : "none"} className={i < review.rating ? "text-[#d4a843]" : "text-gray-300"} />
                  ))}
                </div>

                <p className="text-sm md:text-base text-gray-700 leading-relaxed italic mb-8 flex-grow">
                  "{review.comment}"
                </p>

                {/* 🔥 Product Details Prominent */}
                <div className="bg-white border border-gray-100 p-4 rounded-sm mb-6 flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center shrink-0">
                      <Star size={16} className="text-[#d4a843]" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Reviewed On</span>
                      <Link href={`/products/${review.productSlug}`} className="text-xs font-bold text-black hover:text-[#d4a843] transition-colors line-clamp-1">
                        {review.productName}
                      </Link>
                   </div>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">{review.name}</h4>
                    <span className="text-[9px] font-bold text-[#d4a843] uppercase tracking-widest">Verified Buyer</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                <Star size={32} className="mx-auto text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">No Reviews Yet</p>
                <p className="text-xs text-gray-500">Wait for your customers to share their amazing experiences.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}