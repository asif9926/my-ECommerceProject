"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Filter, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

const fetchProducts = async () => {
    try {
      // 🔥 Ultimate Cache Buster: URL এর শেষে টাইমস্ট্যাম্প অ্যাড করে দেওয়া হলো, 
      // যাতে Next.js বা ব্রাউজার কোনোভাবেই পুরনো ডেটা দেখাতে না পারে!
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/products?t=${timestamp}`, { 
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
      
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const catName = typeof p.category === 'object' ? p.category?.name : p.category;
    
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (catName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || catName === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const deleteProduct = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts(); // ডিলিট হওয়ার পর সাথে সাথে লিস্ট আপডেট হবে
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-['Syne']">Loading Catalog...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Syne'] tracking-tight">
            Product Catalog
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your inventory and product showcases</p>
        </div>
        
        <Link 
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#d4a843] text-white rounded-sm text-xs font-bold hover:bg-[#b88e33] transition-all shadow-md uppercase tracking-widest"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* ── FILTER & SEARCH ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        
        <div className="md:col-span-8 relative flex items-center">
          <Search className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            className="w-full py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4a843] text-sm bg-white shadow-sm"
            style={{ paddingLeft: "42px", paddingRight: "16px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="md:col-span-4 flex gap-2">
          <div className="relative flex-grow flex items-center">
            <Filter className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
            <select 
              className="w-full py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4a843] text-sm bg-white appearance-none cursor-pointer"
              style={{ paddingLeft: "42px", paddingRight: "16px" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Accessories">Accessories</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS TABLE ── */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Inventory</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">

{/* 🔥 Empty State (Fixed Layout) */}
              {filteredProducts.length === 0 ? (
                <tr>
                  {/* whitespace-normal অ্যাড করা হয়েছে যাতে ডিজাইন চ্যাপ্টা না হয় */}
                  <td colSpan={5} className="px-6 py-24 text-center text-gray-500 whitespace-normal bg-gray-50/30">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Package size={40} className="text-gray-400" />
                      </div>
                      <p className="text-xl text-gray-900 font-bold font-['Syne']">No products found</p>
                      <p className="text-sm mt-2 mb-6 text-gray-500">Your catalog is currently empty. Start building your store by adding your first product.</p>
                      <Link 
                        href="/admin/products/new" 
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a843] text-white rounded-sm text-xs font-bold hover:bg-[#b88e33] transition-all shadow-md uppercase tracking-widest"
                      >
                        <Plus size={18}/> Add your first product
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (

                filteredProducts.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    {/* Info */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-gray-100 border border-gray-200 rounded-sm overflow-hidden relative shrink-0">
                          <img src={product.images?.[0]?.url || product.image || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-[#d4a843] transition-colors whitespace-normal line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-tighter uppercase">ID: #{product._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-sm uppercase tracking-tight">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                      </span>
                    </td>
                    
                    {/* Inventory */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${product.countInStock > 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {product.countInStock || 0} in stock
                        </span>
                        <div className="w-24 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${product.countInStock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${Math.min((product.countInStock || 0) * 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Price */}
                    <td className="px-6 py-5">
                      <p className="font-black text-gray-900 text-base">৳{product.price}</p>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/edit/${product._id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 border border-gray-200 rounded-sm transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        {/* 🔥 ID দিয়ে ডিলিট করা হচ্ছে */}
                        <button 
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 border border-gray-200 rounded-sm transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}