import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    
    // ইমেইল দিয়ে ডাটাবেস থেকে ওই নির্দিষ্ট ইউজারের সব অর্ডার খোঁজা হচ্ছে
    const orders = await Order.find({ "shippingInfo.email": email }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}