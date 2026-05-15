import { Metadata } from "next";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Settings from "@/models/Settings";
import ProductDetailsClient from "./ProductDetailsClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// 🔥 SEO Metadata (গুগলে র্যাংক করার জন্য)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Twille`,
    description: product.description?.substring(0, 160),
    openGraph: {
      images: [typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url || ""],
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  // Parallel Data Fetching
  const [productData, settings] = await Promise.all([
    Product.findOne({ slug }).populate({ path: "category", model: Category }).lean(),
    Settings.findOne().lean()
  ]);

  if (!productData) notFound();

  // Related Products
  const relatedProducts = await Product.find({
    category: productData.category,
    _id: { $ne: productData._id }
  }).limit(4).lean();

  // Client Component-এ ডাটা পাঠানোর জন্য JSON Stringify
  const product = JSON.parse(JSON.stringify(productData));
  const related = JSON.parse(JSON.stringify(relatedProducts));
  // @ts-ignore
  const freeShippingLimit = settings?.shipping?.freeShippingThreshold || settings?.freeShippingThreshold || 0;

  return (
    <ProductDetailsClient 
      initialProduct={product} 
      relatedProducts={related} 
      freeShippingLimit={Number(freeShippingLimit)} 
    />
  );
}