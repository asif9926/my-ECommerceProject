"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Sparkles, UploadCloud, Loader2, X, Plus, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const subCategoryOptions: any = {
  "Men": ["T-Shirt", "Shirt", "Polo", "Jeans", "Panjabi", "Hoodie", "Jacket", "Jersey"],
  "Women": ["T-Shirt", "Kurti", "Saree", "Tops", "Leggings", "3-Piece", "Gown", "Jersey"],
  "Accessories": ["Watch", "Wallet", "Bag", "Belt", "Cap", "Sunglasses"],
  "Kids": ["T-Shirt", "Pant", "Dress", "Toys", "Jersey"]
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // Next.js 15 style param unwrapping
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    variants: [] as string[], // 🔥 Variants স্টেট যোগ করা হয়েছে
    isFeatured: false,
  });

  // ১. ক্যাটাগরি এবং প্রোডাক্টের পুরনো ডেটা লোড করা
  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.categories);

        const prodRes = await fetch(`/api/products/${id}`);
        const prodData = await prodRes.json();
        
        if (prodData.success) {
          const p = prodData.product;
          setFormData({
            name: p.name || "",
            description: p.description || "",
            price: p.price?.toString() || "",
            discountPrice: p.discountPrice?.toString() || "",
            category: p.category?._id || p.category || "",
            subCategory: p.subCategory || "",
            images: p.images || [],
            sizes: p.sizes || [],
            variants: p.variants || [], // 🔥 পুরনো Variants ডেটা লোড করা হচ্ছে
            isFeatured: p.isFeatured || false,
          });
        }
      } catch (error) {
        toast.error("Failed to load product data");
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [id]);

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
    setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) });
  };

  // ===================== IMAGE UPLOAD =====================
  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
        setFormData({ ...formData, images: [...formData.images, { url: uploadedImage.secure_url }] });
        toast.success("Image added!");
      }
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  // ===================== SUBMIT (UPDATE) =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
        router.refresh();
      }
    } catch (error) {
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center font-['Syne']">Fetching product details...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-['Syne']">Edit Product</h1>
        </div>
        <button 
          onClick={handleSubmit} disabled={loading || isUploading}
          className="bg-[#d4a843] hover:bg-[#c2983b] text-white px-6 py-2.5 rounded-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
        >
          {loading ? "Updating..." : <><Save size={18} /> Update Product</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Body */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:border-[#d4a843] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:border-[#d4a843] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (৳)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:border-[#d4a843] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (৳)</label>
                  <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:border-[#d4a843] focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Sizes Section */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Inventory (Sizes & Stock)</h2>
              <button type="button" onClick={addSizeRow} className="text-xs bg-black text-white px-3 py-1.5 rounded-sm font-bold flex items-center gap-1"><Plus size={14} /> Add Size</button>
            </div>
            {formData.sizes.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 mb-2 rounded-sm border border-gray-200">
                <input type="text" value={item.size} onChange={(e) => updateSize(index, "size", e.target.value)} placeholder="Size" className="flex-1 border border-gray-300 px-3 py-2 rounded-sm text-sm" />
                <input type="number" value={item.stock} onChange={(e) => updateSize(index, "stock", Number(e.target.value))} placeholder="Stock" className="flex-1 border border-gray-300 px-3 py-2 rounded-sm text-sm" />
                <button type="button" onClick={() => removeSizeRow(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          {/* 🔥 Variants Section (Optional) */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
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

        {/* Right Side: Category & Images */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Organization</h2>
            <div className="space-y-4">
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm bg-white focus:outline-none">
                <option value="">Select category</option>
                {categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
              </select>
              {selectedCategoryName && (
                <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm bg-white focus:outline-none">
                  <option value="">Select sub-category</option>
                  {currentSubCategories.map((sub: string) => (<option key={sub} value={sub}>{sub}</option>))}
                </select>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Gallery</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {formData.images.map((img, index) => (
                <div key={index} className="aspect-square relative group rounded-sm overflow-hidden border border-gray-200">
                  <img src={img.url} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button>
                </div>
              ))}
            </div>
            <div className="relative p-4 border-2 border-dashed border-gray-300 rounded-sm text-center hover:bg-gray-50 transition-colors">
              {isUploading ? <Loader2 className="animate-spin mx-auto text-[#d4a843]" /> : <><UploadCloud className="mx-auto text-gray-400" /><span className="text-xs font-bold text-gray-500 mt-1 block">Add Image</span></>}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}