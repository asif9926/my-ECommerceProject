import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    // আগের কোনো ডামি ডেটা থাকলে মুছে ফেলবে (যাতে বারবার ডুপ্লিকেট না হয়)
    await Product.deleteMany({});
    await Category.deleteMany({});

    // ১. ক্যাটাগরি তৈরি করা
    const menCategory = await Category.create({ name: "Men", slug: "men" });
    const womenCategory = await Category.create({ name: "Women", slug: "women" });
    const accCategory = await Category.create({ name: "Accessories", slug: "accessories" });

    // ২. প্রোডাক্ট তৈরি করা
    const dummyProducts = [
      {
        name: "Premium Cotton T-Shirt",
        slug: "premium-cotton-t-shirt",
        description: "High-quality, breathable 100% cotton t-shirt perfect for everyday wear.",
        category: menCategory._id,
        images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop" }],
        price: 1200,
        discountPrice: 999,
        variants: [{ size: "M", color: "Black", stock: 50 }, { size: "L", color: "Black", stock: 30 }],
        isFeatured: true
      },
      {
        name: "Classic Denim Jacket",
        slug: "classic-denim-jacket",
        description: "Timeless denim jacket with a comfortable fit and durable stitching.",
        category: womenCategory._id,
        images: [{ url: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1000&auto=format&fit=crop" }],
        price: 3500,
        variants: [{ size: "S", color: "Blue", stock: 20 }, { size: "M", color: "Blue", stock: 25 }],
        isFeatured: true
      },
      {
        name: "Elegant Evening Dress",
        slug: "elegant-evening-dress",
        description: "Stunning evening dress designed to make you stand out at any event.",
        category: womenCategory._id,
        images: [{ url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000&auto=format&fit=crop" }],
        price: 4500,
        discountPrice: 3999,
        variants: [{ size: "M", color: "Red", stock: 15 }],
        isFeatured: true
      },
      {
        name: "Minimalist Leather Watch",
        slug: "minimalist-leather-watch",
        description: "Elegant timepiece with a genuine leather strap and sleek dial.",
        category: accCategory._id,
        images: [{ url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop" }],
        price: 2500,
        isFeatured: true
      }
    ];

    await Product.insertMany(dummyProducts);

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully with Categories and Products! 🎉" 
    });

  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}