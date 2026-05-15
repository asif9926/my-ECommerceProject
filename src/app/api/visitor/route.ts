import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Visitor from "@/models/Visitor";

export async function POST() {
  try {
    await connectDB();
    const today = new Date().toISOString().split("T")[0]; // Ajker date
    
    await Visitor.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}