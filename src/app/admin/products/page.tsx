import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

// এটি Server Component, তাই সরাসরি ডাটাবেস কল করা যাচ্ছে
export default async function AdminProductsPage() {
  await connectDB();
  
  // ডাটাবেস থেকে সব প্রোডাক্ট নিয়ে আসা হচ্ছে (নতুনগুলো আগে দেখাবে)
  const products = await Product.find({}).populate("category", "name").sort({ createdAt: -1 });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Syne']">Products</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-[#d4a843] hover:bg-[#c2983b] text-white px-4 py-2.5 rounded-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-medium text-gray-900 mb-1">No products found</p>
                      <p>Start by adding your first product to the store.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id.toString()} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
                        <img src={product.images[0]?.url || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Slug: {product.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.category?.name || <span className="text-gray-400 italic">Uncategorized</span>}
                    </td>
                    <td className="px-6 py-4">
                      {product.discountPrice ? (
                        <div>
                          <span className="font-semibold text-[#e74c3c]">৳{product.discountPrice}</span>
                          <span className="text-xs text-gray-400 line-through block mt-0.5">৳{product.price}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">৳{product.price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm ${
                        product.isFeatured ? 'bg-[#d4a843]/10 text-[#b58e35]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={18} />
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