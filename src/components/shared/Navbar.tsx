"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Heart, Ruler, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import CartDrawer from "./CartDrawer";

const menSubCategories = ["T-Shirt", "Shirt", "Polo", "Jeans", "Panjabi", "Hoodie", "Jacket", "Jersey"];
const womenSubCategories = ["T-Shirt", "Kurti", "Saree", "Tops", "Leggings", "3-Piece", "Gown", "Jersey"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenOpen, setMobileMenOpen] = useState(false);
  const [mobileWomenOpen, setMobileWomenOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 🔥 SEARCH STATES
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]); 
  const [isSearching, setIsSearching] = useState(false); 
  
  const pathname = usePathname();
  const router = useRouter(); 
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state: any) => state.items);
  const { data: session } = useSession();

  // Settings fetch
  useEffect(() => {
    setMounted(true);
    const fetchSettings = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/admin/settings?t=${timestamp}`, { 
          cache: "no-store"
        });
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Settings fetch failed:", error);
      }
    };
    fetchSettings();
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 LIVE SEARCH SUGGESTIONS LOGIC
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]); 
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        
        if (data.success) {
          const filtered = data.products.filter((p: any) => 
            p.name?.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5); 
          
          setSuggestions(filtered);
        }
      } catch (error) {
        console.error("Suggestion fetch failed", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle manual search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      {settings?.announcement?.isActive && settings?.announcement?.text && (
        <div className="bg-[#111] text-white text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-1.5 transition-all">
          {settings.announcement.text} 
          {settings?.shipping?.freeShippingThreshold > 0 && (
            <span className="text-[#d4a843] font-bold ml-1">
              | FREE SHIPPING OVER ৳{settings.shipping.freeShippingThreshold}
            </span>
          )}
        </div>
      )}

      {/* ── MAIN NAVBAR ── */}
      <header className={`sticky top-0 z-50 w-full h-16 flex items-center transition-all duration-500 border-b border-gray-100/50 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-full relative">
            
            {/* 🔥 Tablet/Mobile er jonno lg:hidden use kora hoyeche jeno overlap na hoy */}
            <button className="lg:hidden hover:text-[#d4a843] transition-colors p-2 -ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>

            <Link href="/" className="flex-1 lg:flex-none flex justify-center lg:justify-start pt-1">
              <Image 
                src="/logo.png" 
                alt="Twille Logo" 
                width={160} 
                height={45} 
                priority 
              />
            </Link>

            {/* 🔥 Desktop Nav: Ekhon sudhu lg ba tar theke boro screen ei dekhabe */}
            <nav className="hidden lg:flex items-center justify-center gap-4 lg:gap-8 font-medium text-xs text-gray-900 tracking-[0.15em] absolute left-1/2 -translate-x-1/2 w-max">
              <Link href="/" className="hover:text-[#d4a843] transition-colors uppercase">HOME</Link>
              
              <div className="relative group py-6 -my-6 cursor-pointer">
                <Link href="/products?category=men" className="flex items-center gap-1 hover:text-[#d4a843] transition-colors uppercase">
                  MEN <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-5 flex flex-col gap-3">
                    {menSubCategories.map(sub => (
                      <Link key={sub} href={`/products?category=men&subCategory=${sub}`} className="text-[11px] text-gray-600 hover:text-[#d4a843] hover:translate-x-1 transition-all uppercase tracking-widest">
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group py-6 -my-6 cursor-pointer">
                <Link href="/products?category=women" className="flex items-center gap-1 hover:text-[#d4a843] transition-colors uppercase">
                  WOMEN <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-5 flex flex-col gap-3">
                    {womenSubCategories.map(sub => (
                      <Link key={sub} href={`/products?category=women&subCategory=${sub}`} className="text-[11px] text-gray-600 hover:text-[#d4a843] hover:translate-x-1 transition-all uppercase tracking-widest">
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/products?category=Accessories" className="hover:text-[#d4a843] transition-colors uppercase">ACCESSORIES</Link>
              <Link href="/products?sale=true" className="text-[#e74c3c] font-bold hover:text-[#c0392b] transition-colors uppercase">SALE</Link>
            </nav>

            <div className="flex items-center gap-4 sm:gap-5 text-black flex-1 lg:flex-none justify-end">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="hover:text-[#d4a843] transition-colors hidden sm:flex items-center"
              >
                {isSearchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
              </button>
              
              <Link href="/size-finder" className="hover:text-[#d4a843] transition-colors hidden sm:flex items-center">
                <Ruler size={18} strokeWidth={1.5} />
              </Link>

              <div className="relative group flex items-center h-full py-4 -my-4 cursor-pointer">
                <Link href={session ? "/profile" : "/login"} className="hover:text-[#d4a843] transition-colors flex items-center">
                  <User size={18} strokeWidth={1.5} />
                </Link>
                {session && (
                  <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="w-44 bg-white border border-gray-100 shadow-xl py-2 flex flex-col">
                      {(session.user as any)?.role === "admin" && (
                        <Link href="/admin" className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-50 border-b border-gray-50 flex items-center gap-2">
                          <LayoutDashboard size={14} /> Admin Panel
                        </Link>
                      )}
                      <Link href="/profile" className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <User size={14} /> My Profile
                      </Link>
                      <button onClick={() => signOut()} className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-2 text-left w-full">
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/wishlist" className="relative text-gray-600 hover:text-[#d4a843] transition-colors">
                <Heart size={20} strokeWidth={1.5} />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#d4a843] text-white text-[9px] font-bold shadow-md ring-1 ring-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsCartOpen(true)} className="relative hover:text-[#d4a843] transition-colors flex items-center">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#d4a843] text-[9px] font-bold text-white shadow-sm ring-1 ring-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* 🔥 SEARCH DROPDOWN BAR WITH SUGGESTIONS */}
        <div className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 z-40 ${isSearchOpen ? "py-6 opacity-100 visible" : "h-0 py-0 opacity-0 invisible"}`}>
          <div className="container mx-auto px-4 md:px-8 relative">
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for clothes, styles, or collections..."
                className="w-full border-b-2 border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#d4a843] bg-transparent"
                autoFocus={isSearchOpen}
              />
              <button type="submit" className="text-gray-900 hover:text-[#d4a843] p-2 transition-colors">
                <Search size={20} strokeWidth={1.5} />
              </button>
            </form>

            {/* SUGGESTIONS BOX */}
            {searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-2xl mt-1 bg-white border border-gray-100 shadow-xl max-h-[60vh] overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="flex flex-col">
                    <span className="p-3 bg-gray-50 text-[9px] uppercase font-bold tracking-widest text-gray-500 border-b border-gray-100">
                      Product Suggestions
                    </span>
                    {suggestions.map((product) => {
                      const imgSrc = (product.images?.[0] && typeof product.images[0] === 'string' && product.images[0].trim() !== '') 
                        ? product.images[0] 
                        : fallbackImage;

                      return (
                        <Link 
                          key={product._id} 
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setSuggestions([]);
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                        >
                          <div className="w-12 h-12 bg-gray-100 relative shrink-0 overflow-hidden rounded-sm border border-gray-200">
                            <img 
                              src={imgSrc} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = fallbackImage; }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {product.discountPrice ? (
                                <>
                                  <span className="text-[11px] font-bold text-red-500">৳{product.discountPrice}</span>
                                  <span className="text-[10px] text-gray-400 line-through">৳{product.price}</span>
                                </>
                              ) : (
                                <span className="text-[11px] font-bold text-gray-900">৳{product.price}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <button 
                      onClick={handleSearch}
                      className="w-full p-3 text-[10px] font-bold uppercase tracking-widest text-center text-[#d4a843] hover:bg-gray-50 transition-colors"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE & TABLET MENU ── */}
      {/* 🔥 lg:hidden use kora hoyeche jate tablet eo ei menu ta show kore */}
      <div className={`lg:hidden fixed top-16 left-0 w-full bg-white border-t border-gray-100 shadow-xl overflow-y-auto transition-all duration-300 z-40 ${isMobileMenuOpen ? "max-h-[calc(100vh-64px)] opacity-100 border-b" : "max-h-0 opacity-0 border-transparent"}`}>
        <div className="px-6 py-6 flex flex-col gap-6">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em]">HOME</Link>
          
          <div>
            <div className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-[0.15em]">
              <Link href="/products?category=men" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-left py-1 hover:text-[#d4a843] transition-colors">
                MEN
              </Link>
              <button onClick={() => setMobileMenOpen(!mobileMenOpen)} className="p-2 -mr-2 text-gray-400 hover:text-[#d4a843] transition-colors">
                <ChevronDown size={16} className={`transition-transform duration-300 ${mobileMenOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className={`flex flex-col gap-5 overflow-hidden transition-all duration-300 ${mobileMenOpen ? "max-h-[400px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
              {menSubCategories.map(sub => (
                <Link key={sub} href={`/products?category=men&subCategory=${sub}`} onClick={() => setIsMobileMenuOpen(false)} className="pl-4 text-[11px] font-medium text-gray-500 hover:text-[#d4a843] uppercase tracking-widest">
                  {sub}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-[0.15em]">
              <Link href="/products?category=women" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-left py-1 hover:text-[#d4a843] transition-colors">
                WOMEN
              </Link>
              <button onClick={() => setMobileWomenOpen(!mobileWomenOpen)} className="p-2 -mr-2 text-gray-400 hover:text-[#d4a843] transition-colors">
                <ChevronDown size={16} className={`transition-transform duration-300 ${mobileWomenOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className={`flex flex-col gap-5 overflow-hidden transition-all duration-300 ${mobileWomenOpen ? "max-h-[400px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
              {womenSubCategories.map(sub => (
                <Link key={sub} href={`/products?category=women&subCategory=${sub}`} onClick={() => setIsMobileMenuOpen(false)} className="pl-4 text-[11px] font-medium text-gray-500 hover:text-[#d4a843] uppercase tracking-widest">
                  {sub}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/products?category=Accessories" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em]">ACCESSORIES</Link>
          <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em]">COLLECTIONS</Link>
          <Link href="/products?sale=true" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-[#e74c3c] uppercase tracking-[0.15em]">SALE</Link>
          
          <div className="border-t border-gray-100 pt-6 mt-2 flex flex-col gap-5">
            {session ? (
              <>
                {(session.user as any)?.role === "admin" && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-3">
                    <LayoutDashboard size={18} strokeWidth={1.5} /> Admin Panel
                  </Link>
                )}
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-3">
                  <User size={18} strokeWidth={1.5} /> My Profile
                </Link>
                <button onClick={() => {signOut(); setIsMobileMenuOpen(false);}} className="text-[11px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-3 text-left">
                  <LogOut size={18} strokeWidth={1.5} /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-3">
                <User size={18} strokeWidth={1.5} /> Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}