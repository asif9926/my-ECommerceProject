import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: "success", 
      message: "MongoDB Connected Successfully! 🎉" 
    }, { status: 200 });
  } catch (error) {
    console.error("DB Connection Error:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Failed to connect to Database ❌" 
    }, { status: 500 });
  }
}