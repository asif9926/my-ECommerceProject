import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{
    url: String,
    publicId: String
  }],
  variants: [{
    size: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] },
    color: String,
    colorHex: String,
    stock: { type: Number, default: 0 }
  }],
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  tags: [{ type: String }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isFeatured: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDesc: { type: String }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);