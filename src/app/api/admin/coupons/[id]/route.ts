import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    await Coupon.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}