import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String,
    required: false // Google login-er jonno eta optional kora hoyeche
  },
  
  // Authorization & Roles
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  
  // Email Verification (OTP System)
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verifyCode: { 
    type: String 
  },
  verifyCodeExpiry: { 
    type: Date 
  },
  // 🔥 Forgot Password (OTP System)
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },

  // Profile Information
  avatar: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  addresses: [{
    label: String,
    street: String,
    city: String,
    district: String,
    isDefault: { type: Boolean, default: false }
  }],
  
  // Social Logins
  googleId: { 
    type: String 
  },
}, { 
  timestamps: true // Eti automatically createdAt ebong updatedAt field toiri korbe
});

// Next.js dev mode-e model re-compilation error bondho korar jonno eibhabe export kora holo
export default mongoose.models.User || mongoose.model("User", userSchema);