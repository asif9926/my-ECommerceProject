import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category"; // আপনার Category মডেল

export async function GET() {
  try {
    await connectDB();
    
    // 🔥 Magic Trick: ডিফল্ট ক্যাটাগরিগুলো ডাটাবেসে না থাকলে অটোমেটিক তৈরি করে নেবে!
    const defaultCategories = ["Men", "Women", "Accessories", "Kids"];
    
    for (const catName of defaultCategories) {
      const exists = await Category.findOne({ name: catName });
      if (!exists) {
        // ক্যাটাগরি না থাকলে নতুন তৈরি করবে
        await Category.create({ 
          name: catName, 
          slug: catName.toLowerCase() 
        });
      }
    }

    const categories = await Category.find({});
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch categories" }, { status: 500 });
  }
}

// (যদি আপনার ফাইলে POST ফাংশন থাকে, তবে সেটি আগের মতোই রেখে দেবেন)