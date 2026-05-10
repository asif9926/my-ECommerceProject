import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const body = await req.json();
    const params = await props.params;

    // ডাটাবেসে অর্ডারের স্ট্যাটাস আপডেট করা হচ্ছে
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { status: body.status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}