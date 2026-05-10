import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: String },
  phone: { type: String },
  addresses: [{
    label: String,
    street: String,
    city: String,
    district: String,
    isDefault: { type: Boolean, default: false }
  }],
  googleId: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);