import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // শুধুমাত্র এই নির্দিষ্ট ইউজারের অর্ডারগুলো খোঁজা হচ্ছে
    const orders = await Order.find({ user: (session.user as any).id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("User orders fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch your orders" }, { status: 500 });
  }
}