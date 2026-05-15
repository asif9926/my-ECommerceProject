import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Model initialize করার জন্য

// ডেটা যাতে ক্যাশ না হয়
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // 🔥 নতুন: URL থেকে সার্চ প্যারামিটার (q) ধরা হচ্ছে
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("q");

    // 🔥 নতুন: ডাটাবেস ফিল্টার করার জন্য কোয়েরি অবজেক্ট তৈরি
    let query: any = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } }, // 'i' মানে Case-insensitive
        { description: { $regex: searchQuery, $options: "i" } }
      ];
    }

    // ১. প্রথমে স্বাভাবিকভাবে category-সহ প্রোডাক্ট আনার চেষ্টা করবে
    try {
      const products = await Product.find(query) // 🔥 query অবজেক্ট পাস করা হলো
        .populate("category")
        .sort({ createdAt: -1 });
        
      return NextResponse.json({ success: true, products });
    } catch (populateError) {
      console.log("Populate Error (Old Data):", populateError);
      
      // ২. ব্যাকআপ লজিক
      const fallbackProducts = await Product.find(query).sort({ createdAt: -1 }); // 🔥 query পাস করা হলো
      return NextResponse.json({ success: true, products: fallbackProducts });
    }
    
  } catch (error: any) {
    console.error("Products Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { 
      name, description, price, discountPrice, 
      category, subCategory, images, sizes, isFeatured 
    } = body;

    let totalStock = 0;
    if (sizes && sizes.length > 0) {
      totalStock = sizes.reduce((acc: number, curr: any) => acc + Number(curr.stock), 0);
    }

    const product = await Product.create({
      name, description, price, discountPrice, category, subCategory,
      images, sizes, countInStock: totalStock, isFeatured
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}