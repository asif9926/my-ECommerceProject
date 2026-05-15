import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

// ১. GET - প্রোডাক্ট আনা
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;

    let product;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug).populate("category");
    } else {
      product = await Product.findOne({ slug: slug }).populate("category");
    }

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ২. PATCH - প্রোডাক্ট আপডেট করা
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await req.json();
    
    const { 
      name, description, price, discountPrice, 
      category, subCategory, images, sizes, isFeatured 
    } = body;

    // 🔥 FIXED: sizes আপডেট হলে টোটাল স্টক আবার হিসাব করা হচ্ছে
    let totalStock = 0;
    if (sizes && sizes.length > 0) {
      totalStock = sizes.reduce((acc: number, curr: any) => acc + Number(curr.stock), 0);
    }

    // 🔥 FIXED: id এবং slug দুইভাবেই আপডেট কাজ করবে
    const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug: slug };

    const product = await Product.findOneAndUpdate(
      query,
      { 
        name, description, price, discountPrice, 
        category, subCategory, images, sizes, 
        countInStock: totalStock, // Updated Stock
        isFeatured 
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ৩. DELETE - প্রোডাক্ট ডিলিট করা
export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    
    // 🔥 FIXED: id এবং slug দুইভাবেই ডিলিট কাজ করবে
    const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug: slug };
    
    const product = await Product.findOneAndDelete(query);
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}