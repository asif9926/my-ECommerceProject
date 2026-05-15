"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Sparkles, UploadCloud, Loader2, X, Plus, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// সাব-ক্যাটাগরির লিস্ট
const subCategoryOptions: any = {
  "Men": ["T-Shirt", "Shirt", "Polo", "Jeans", "Panjabi", "Hoodie", "Jacket", "Jersey"],
  "Women": ["T-Shirt", "Kurti", "Saree", "Tops", "Leggings", "3-Piece", "Gown", "Jersey"],
  "Accessories": ["Watch", "Wallet", "Bag", "Belt", "Cap", "Sunglasses"],
  "Kids": ["T-Shirt", "Pant", "Dress", "Toys", "Jersey"] 
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // 🔥 Variants এর জন্য ইনপুট স্টেট
  const [variantInput, setVariantInput] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    images: [] as { url: string }[], 
    sizes: [] as { size: string, stock: number }[], 
    variants: [] as string[], // 🔥 Variants যুক্ত করা হলো
    isFeatured: false,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      });
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const selectedCategoryName = categories.find((c: any) => c._id === formData.category)?.name || "";
  const currentSubCategories = subCategoryOptions[selectedCategoryName] || ["Other"];

  // ===================== SIZES & STOCK LOGIC =====================
  const addSizeRow = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, { size: "", stock: 0 }] });
  };

  const updateSize = (index: number, field: string, value: string | number) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeSizeRow = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  // ===================== MULTIPLE IMAGE UPLOAD =====================
  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: uploadData,
      });

      const uploadedImage = await res.json();

      if (uploadedImage.secure_url) {
        setFormData({ 
          ...formData, 
          images: [...formData.images, { url: uploadedImage.secure_url }] 
        });
        toast.success("Image added to gallery!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      toast.error("Image upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // ===================== AI DESCRIPTION =====================
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
          category: selectedCategoryName || "Clothing" 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, description: data.description });
        toast.success("AI Description generated successfully!");
      }
    } catch (error) {
      toast.error("AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ===================== SUBMIT FORM =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Please upload at least one product image!");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        category: formData.category,
        subCategory: formData.subCategory,
        images: formData.images,
        sizes: formData.sizes, 
        variants: formData.variants, // 🔥 Variants ডাটাবেসে পাঠানো হচ্ছে
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
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-['Syne']">Add New Product</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading || isUploading}
          className="bg-[#d4a843] hover:bg-[#c2983b] text-white px-6 py-2.5 rounded-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
        >
          {loading ? "Saving..." : <><Save size={18} /> Save Product</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= LEFT SIDE: MAIN INFO & SIZES ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843]" 
                  placeholder="e.g. Premium Cotton T-Shirt" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <button 
                    type="button" onClick={generateAIDescription} disabled={isGenerating}
                    className="text-[11px] bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-sm font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                  >
                    {isGenerating ? "✨ Generating..." : <><Sparkles size={12} /> Write with AI</>}
                  </button>
                </div>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange} rows={5} required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843]" 
                  placeholder="Detailed description..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (৳)</label>
                  <input 
                    type="number" name="price" value={formData.price} onChange={handleChange} required
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (৳)</label>
                  <input 
                    type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843]" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sizes & Inventory Section */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Sizes & Inventory</h2>
              <button 
                type="button" onClick={addSizeRow}
                className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-sm font-bold flex items-center gap-1 hover:bg-gray-800 transition-colors"
              >
                <Plus size={14} /> Add Size
              </button>
            </div>
            
            {formData.sizes.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-sm">
                <p className="text-sm text-gray-500">No sizes added yet. Click "Add Size" to manage inventory.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.sizes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-sm border border-gray-200">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Size / Variant</label>
                      <input 
                        type="text" value={item.size} onChange={(e) => updateSize(index, "size", e.target.value)}
                        placeholder="e.g. M, L, XL or 32" 
                        className="w-full border border-gray-300 px-3 py-2 rounded-sm text-sm focus:outline-none focus:border-[#d4a843]" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Stock Qty</label>
                      <input 
                        type="number" value={item.stock} onChange={(e) => updateSize(index, "stock", Number(e.target.value))}
                        placeholder="0" 
                        className="w-full border border-gray-300 px-3 py-2 rounded-sm text-sm focus:outline-none focus:border-[#d4a843]" 
                      />
                    </div>
                    <div className="pt-5">
                      <button 
                        type="button" onClick={() => removeSizeRow(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-right">
                  <p className="text-sm font-bold text-gray-700">Total Stock: <span className="text-[#d4a843]">{formData.sizes.reduce((a, b) => a + (Number(b.stock) || 0), 0)}</span> Items</p>
                </div>
              </div>
            )}
          </div>

          {/* 🔥 Variants Section (Optional) */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Variants (Optional)</h2>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <input 
                type="text" 
                value={variantInput} 
                onChange={(e) => setVariantInput(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (variantInput.trim()) {
                      setFormData({ ...formData, variants: [...formData.variants, variantInput.trim()] });
                      setVariantInput("");
                    }
                  }
                }}
                placeholder="e.g. Full Sleeve, Cotton (Press Enter)" 
                className="flex-1 border border-gray-300 px-4 py-2.5 rounded-sm focus:border-[#d4a843] focus:outline-none" 
              />
              <button 
                type="button" 
                onClick={() => {
                  if (variantInput.trim()) {
                    setFormData({ ...formData, variants: [...formData.variants, variantInput.trim()] });
                    setVariantInput("");
                  }
                }} 
                className="bg-black text-white px-4 py-2.5 rounded-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
            </div>
            {/* Added Variants Badges */}
            <div className="flex flex-wrap gap-2">
              {formData.variants.map((v, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-sm text-sm font-bold text-gray-700">
                  {v}
                  <button type="button" onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) })} className="text-red-500 hover:text-red-700">
                    <X size={14}/>
                  </button>
                </div>
              ))}
              {formData.variants.length === 0 && (
                <p className="text-xs text-gray-400 italic">No variants added yet. Add variants like "Full Sleeve" etc.</p>
              )}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE: CATEGORY & IMAGES ================= */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
                <select 
                  name="category" value={formData.category} onChange={handleChange} required
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843] bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {selectedCategoryName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                  <select 
                    name="subCategory" value={formData.subCategory} onChange={handleChange} required
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843] bg-white"
                  >
                    <option value="">Select sub-category</option>
                    {currentSubCategories.map((sub: string) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                    className="w-4 h-4 text-[#d4a843] rounded" 
                  />
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1"><Star size={14} className="fill-[#d4a843] text-[#d4a843]" /> Show in Featured</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Product Gallery</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {formData.images.map((img, index) => (
                <div key={index} className="aspect-[4/5] relative group rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {index === 0 && (
                    <div className="absolute top-0 left-0 w-full bg-[#d4a843] text-white text-[9px] font-bold uppercase tracking-widest text-center py-1">
                      Main Cover
                    </div>
                  )}
                  <button 
                    type="button" onClick={() => removeImage(index)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center relative hover:bg-gray-50 transition-colors cursor-pointer text-center">
              {isUploading ? (
                <div className="flex flex-col items-center text-gray-500 py-4">
                  <Loader2 className="animate-spin mb-2 text-[#d4a843]" size={28} />
                  <span className="text-xs font-bold">Uploading...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="text-gray-400 mb-2" size={32} />
                  <span className="text-sm font-bold text-gray-700">Add Image</span>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Up to 5MB</span>
                  <input 
                    type="file" accept="image/*" onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}