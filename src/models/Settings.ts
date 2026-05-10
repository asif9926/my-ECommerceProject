import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  announcement: {
    text: { type: String, default: "FREE SHIPPING ON ORDERS OVER ৳2000" },
    isActive: { type: Boolean, default: true },
    link: { type: String, default: "" } // যদি মেসেজে ক্লিক করলে কোনো পেজে নিতে চান
  },
  storeName: { type: String, default: "BRANDNAME" },
  contactEmail: { type: String },
  contactPhone: { type: String }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);