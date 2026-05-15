import mongoose from "mongoose";

// 🔥 NEW: রিভিউ এর জন্য আলাদা একটি ছোট স্কিমা তৈরি করা হলো
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    
    // Pricing
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    
    // Multiple Images Array
    images: [{ url: { type: String, required: true } }],
    image: { type: String }, 
    
    // Category & Sub-Category
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: String }, 
    
    // Sizes & Individual Inventory
    sizes: [
      {
        size: { type: String, required: true }, 
        stock: { type: Number, required: true, default: 0 }
      }
    ],
    
    // Total Stock
    countInStock: { type: Number, required: true, default: 0 },
    
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // 🔥 NEW: শুধু এই রিভিউ অ্যারে-টি আপনার পুরনো স্কিমায় যুক্ত করা হলো
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// 🔥 আপনার আগের মাস্টারপিস লজিক একদম ১০০% অক্ষত রাখা হয়েছে!
productSchema.pre('save', function() {
  if (this.sizes && this.sizes.length > 0) {
    // সব সাইজের স্টক যোগ করে countInStock এ বসিয়ে দেবে
    this.countInStock = this.sizes.reduce((total, item) => total + (Number(item.stock) || 0), 0);
  }
  
  // স্বয়ংক্রিয়ভাবে slug তৈরি করবে (যদি না থাকে)
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
  }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;