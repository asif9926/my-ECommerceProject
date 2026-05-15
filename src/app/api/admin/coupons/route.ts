import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // রিকোয়ার্ড ফিল্ড চেক করা
    if(!body.code || !body.type || !body.value || !body.expiryDate) {
       return NextResponse.json({ success: false, message: "Please fill all required fields" }, { status: 400 });
    }

    // 🔥 ডাটাবেসে সেভ করার আগে স্ট্রিংগুলোকে জোর করে Number এবং Date-এ কনভার্ট করা হচ্ছে
    const couponData = {
      code: body.code.toUpperCase(),
      type: body.type,
      value: Number(body.value),
      minOrderAmt: Number(body.minOrderAmt || 0),
      maxUses: Number(body.maxUses || 100),
      expiryDate: new Date(body.expiryDate),
      isActive: true
    };

    const coupon = await Coupon.create(couponData);
    return NextResponse.json({ success: true, coupon });
    
  } catch (error: any) {
    // 11000 মানে একই কোড আগে থেকেই আছে
    if(error.code === 11000) {
        return NextResponse.json({ success: false, message: "This Coupon code already exists!" }, { status: 400 });
    }
    // 🔥 এখন ডাটাবেসের অরিজিনাল এরর মেসেজটি ফ্রন্টএন্ডে পাঠাচ্ছি
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}