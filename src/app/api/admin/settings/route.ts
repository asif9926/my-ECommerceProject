import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

// সেটিংস ডেটা আনা
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    
    // যদি ডাটাবেসে কোনো সেটিংস না থাকে, তবে একটি ডিফল্ট তৈরি করবে
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

// সেটিংস ডেটা আপডেট করা
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    let settings = await Settings.findOne();
    if (settings) {
      // পুরনোটা আপডেট করবে
      settings = await Settings.findOneAndUpdate({}, body, { new: true });
    } else {
      // নতুন সেভ করবে
      settings = await Settings.create(body);
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}