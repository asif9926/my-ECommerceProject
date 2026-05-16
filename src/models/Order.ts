import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // ইউজার লগইন করা থাকলে তার আইডি থাকবে, না থাকলে গেস্ট হিসেবে সেভ হবে
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, 
  
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String },
      variant: { type: String }, 
    }
  ],
  
  shippingInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }, // 🔥 FIX: অপশনাল থেকে required করা হলো
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
  },
  
  paymentInfo: {
    method: { type: String, enum: ['instant', 'cod'], required: true },
    mobileNumber: { type: String },   
    transactionId: { type: String },  
    gateway: { type: String, enum: ['bKash', 'Nagad', 'Rocket'] },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verificationNote: { type: String },
  },
  
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending_verification', 'verified', 'failed'],
    default: 'unpaid'
  },
  
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  
  isDelivered: { type: Boolean, default: false },
  status: { type: String, default: "Pending" }, 
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);