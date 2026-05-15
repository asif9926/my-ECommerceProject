import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true }, // discountType এর বদলে type
    value: { type: Number, required: true },                               // discountValue এর বদলে value
    expiryDate: { type: Date, required: true },                            // validUntil এর বদলে expiryDate
    maxUses: { type: Number, default: 100 },                               // usageLimit এর বদলে maxUses
    usedCount: { type: Number, default: 0 },
    minOrderAmt: { type: Number, default: 0 },                             // minimumSpend এর বদলে minOrderAmt
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;