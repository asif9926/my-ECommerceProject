import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    // ফ্রন্টএন্ড থেকে আসা ডেটা দিয়ে ডাটাবেসে নতুন অর্ডার তৈরি
    const newOrder = await Order.create(body);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ success: false, message: "Failed to place order" }, { status: 500 });
  }
}