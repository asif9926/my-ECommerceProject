import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/auth"; // আপনার Auth ফাইলটি ঠিকভাবে ইম্পোর্ট করবেন

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> } // Next.js 15 এর নিয়ম
) {
  try {
    await connectDB();
    const { slug: productId } = await params; 
    const body = await req.json();
    const { rating, comment } = body;

    // ১. ইউজার লগইন করা আছে কি না চেক করা
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Please login to write a review." }, 
        { status: 401 }
      );
    }

    // ২. প্রোডাক্ট খুঁজে বের করা
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // ৩. একই ইউজার আগে রিভিউ দিয়েছে কি না চেক করা
    const alreadyReviewed = product.reviews.find(
      (r: any) => r.user.toString() === (session.user as any).id.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product." }, 
        { status: 400 }
      );
    }

    // ৪. নতুন রিভিউ অবজেক্ট তৈরি
    const review = {
      user: (session.user as any).id,
      name: session.user.name || "Verified Buyer",
      avatar: session.user.image || "", // 🔥 সেশন থেকে অটোমেটিক ছবি নিয়ে ডাটাবেসে সেভ করবে
      rating: Number(rating),
      comment: comment,
    };

    // ৫. ডাটাবেসে সেভ করা এবং রেটিং আপডেট করা
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;
    
    await product.save();

    return NextResponse.json({ success: true, review, message: "Review added!" }, { status: 201 });
  } catch (error: any) {
    console.error("Review Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}