import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    
    // Populate-এর ভেতরে সরাসরি model: Category বলে দেওয়া হলো
    const products = await Product.find({ isFeatured: true })
      .populate({ path: "category", model: Category, select: "name slug" })
      .limit(8);
      
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // নামের ওপর ভিত্তি করে ইউনিক Slug তৈরি করা
    if (!body.slug) {
      const baseSlug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      // নামের শেষে ৫ ডিজিটের একটি র‍্যান্ডম টেক্সট যুক্ত করে দেওয়া হলো
      const uniqueSuffix = Math.random().toString(36).substring(2, 7);
      body.slug = `${baseSlug}-${uniqueSuffix}`;
    }

    const newProduct = await Product.create(body);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}