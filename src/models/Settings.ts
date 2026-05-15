import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    announcement: {
      text: { type: String, default: "" },
      isActive: { type: Boolean, default: true },
    },
    heroBanners: [
      {
        url: { type: String, default: "" },
      },
    ],
    shipping: {
      insideDhaka: { type: Number, default: 60 },
      outsideDhaka: { type: Number, default: 120 },
      freeShippingThreshold: { type: Number, default: 2000 },
    },
    payment: {
      bkashNumber: { type: String, default: "017XXXXXXXX" },
      nagadNumber: { type: String, default: "016XXXXXXXX" },
      rocketNumber: { type: String, default: "019XXXXXXXX" },
      instructions: { type: String, default: "Enter your Name in the Reference section." },
    },
    // 🔥 NEW: Popup Settings Added
    popup: {
      isActive: { type: Boolean, default: false },
      title: { type: String, default: "GET 50% OFF NOW" },
      description: { type: String, default: "Sign up for our page and get 50% off your first purchase!" },
      buttonText: { type: String, default: "SHOP SALE NOW" },
      link: { type: String, default: "/products?sale=true" },
      imageUrl: { type: String, default: "" },
    }
  },
  { 
    timestamps: true,
    strict: false 
  }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;