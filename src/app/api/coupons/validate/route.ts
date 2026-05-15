import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, orderAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Please enter a coupon code" });
    }

    // কুপনটি ডেটাবেসে আছে কিনা এবং অ্যাকটিভ কিনা চেক করা
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid or inactive coupon" });
    }

    // কুপনের মেয়াদ শেষ হয়েছে কিনা
    if (new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ success: false, message: "This coupon has expired" });
    }

    // কুপনটি সর্বোচ্চ কতবার ইউজ করা যাবে তার লিমিট পার হয়েছে কিনা
    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, message: "Coupon usage limit reached" });
    }

    // কুপনটি ইউজ করার জন্য মিনিমাম কত টাকার অর্ডার করতে হবে
    if (orderAmount < coupon.minOrderAmt) {
      return NextResponse.json({ success: false, message: `Minimum order amount must be ৳${coupon.minOrderAmt}` });
    }

    // ডিসকাউন্ট ক্যালকুলেশন
    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = Math.floor((orderAmount * coupon.value) / 100);
    } else {
      discountAmount = coupon.value; // Fixed amount
    }

    return NextResponse.json({ 
      success: true, 
      discountAmount, 
      message: "Coupon applied successfully!" 
    });

  } catch (error) {
    console.error("Coupon error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}