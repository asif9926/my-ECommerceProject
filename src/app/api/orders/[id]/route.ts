import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    // 🔥 এখানে Warning Fix করা হলো
    const order = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { returnDocument: 'after' }
    );
    
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}