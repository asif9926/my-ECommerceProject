"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // AI জেনারেটরের জন্য State
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    imageUrl: "",
    isFeatured: false,
  });

  // পেজ লোড হওয়ার সময় ক্যাটাগরিগুলো নিয়ে আসা
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      });
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // AI কল করার ফাংশন
  const generateAIDescription = async () => {
    if (!formData.name) {
      toast.error("Please enter a product name first!");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productName: formData.name, 
          // ক্যাটাগরির আইডি না পাঠিয়ে নাম পাঠানোর চেষ্টা করছি যাতে AI বুঝতে পারে
          category: categories.find((c: any) => c._id === formData.category)?.name || "Clothing" 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, description: data.description });
        toast.success("AI Description generated successfully!");
      } else {
        toast.error("Failed to generate description.");
      }
    } catch (error) {
      toast.error("Network error. Make sure Gemini API is configured.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        category: formData.category,
        images: [{ url: formData.imageUrl }],
        isFeatured: formData.isFeatured,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product added successfully!");
        router.push("/admin/products"); 
        router.refresh();
      } else {
        toast.error(data.error || "Failed to add product");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-['Syne']">Add New Product</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#d4a843] hover:bg-[#c2983b] text-white px-6 py-2.5 rounded-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
        >
          {loading ? "Saving..." : <><Save size={18} /> Save Product</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Main Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843]" 
                  placeholder="e.g. Premium Cotton T-Shirt" 
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  
                  {/* AI Button Here */}
                  <button 
                    type="button" 
                    onClick={generateAIDescription}
                    disabled={isGenerating}
                    className="text-[11px] bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-sm font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? "✨ Generating..." : <><Sparkles size={12} /> Write with AI</>}
                  </button>
                </div>

                <textarea 
                  name="description" value={formData.description} onChange={handleChange} rows={6} required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843]" 
                  placeholder="Write a detailed description or let AI write it for you..." 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (৳)</label>
                <input 
                  type="number" name="price" value={formData.price} onChange={handleChange} required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843]" 
                  placeholder="0.00" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (৳) <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input 
                  type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843]" 
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Options */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Organization</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                name="category" value={formData.category} onChange={handleChange} required
                className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843] bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                  className="w-4 h-4 text-[#d4a843] focus:ring-[#d4a843] border-gray-300 rounded" 
                />
                <span className="text-sm font-medium text-gray-700">Show in New Arrivals</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Product Image</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required
                className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843] mb-4" 
                placeholder="https://images.unsplash.com/..." 
              />
              
              {/* Image Preview */}
              <div className="w-full aspect-[4/5] bg-gray-50 border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center overflow-hidden relative">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <>
                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-500">Image Preview</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}