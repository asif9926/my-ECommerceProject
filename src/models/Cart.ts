import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    size: String,
    variant: String, // 🔥 color এর বদলে variant করা হলো
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);