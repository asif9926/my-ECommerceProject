import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order"; // 🔥 FIX: Order model ইমপোর্ট করা হলো

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // যদি আগে থেকেই ভেরিফাইড থাকে
    if (user.isVerified) {
      return NextResponse.json({ message: "Email is already verified." }, { status: 400 });
    }

    // OTP চেক করা
    if (user.verifyCode !== otp) {
      return NextResponse.json({ message: "Invalid OTP! Please try again." }, { status: 400 });
    }

    // OTP এর মেয়াদ চেক করা (১৫ মিনিট)
    if (new Date() > new Date(user.verifyCodeExpiry)) {
      return NextResponse.json({ message: "OTP has expired. Please register again." }, { status: 400 });
    }

    // সবকিছু ঠিক থাকলে ইউজারকে ভেরিফাইড করে দেওয়া
    user.isVerified = true;
    user.verifyCode = undefined; // সিকিউরিটির জন্য OTP মুছে দেওয়া
    user.verifyCodeExpiry = undefined;
    await user.save();

    // 🔥 MAGIC SYNC: User ভেরিফাইড হওয়ার সাথে সাথে তার আগের সব গেস্ট অর্ডার এই অ্যাকাউন্টে শিফট হবে!
    // 🔥 MAGIC SYNC: User verified howar sathe sathe tar aager shob guest order ei account e shift hobe!
    await Order.updateMany(
  { 
    "shippingInfo.email": { $regex: new RegExp(`^${email}$`, "i") }, 
    $or: [
      { user: null },
      { user: { $exists: false } }
    ]
  }, 
  { $set: { user: user._id } }
);

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ message: "An error occurred during verification." }, { status: 500 });
  }
}