import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category"; 

export async function GET(req: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  try {
    await connectDB();
    
    const params = await context.params;
    const slug = params.slug;
    
    // এখানেও Populate-এর ভেতরে model: Category দেওয়া হলো
    const product = await Product.findOne({ slug })
      .populate({ path: "category", model: Category, select: "name" });
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching single product:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product details" }, { status: 500 });
  }
}