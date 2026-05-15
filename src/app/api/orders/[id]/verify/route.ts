import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    // 🔥 Next.js 15+ এ params await করতে হয়
    const { id } = await params; 
    const { paymentStatus, orderStatus } = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    if (orderStatus) order.status = orderStatus;
    
    if (paymentStatus === 'verified') {
        order.paymentInfo.verifiedAt = new Date();
    }

    await order.save();
    return NextResponse.json({ success: true, message: "Payment verified!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}