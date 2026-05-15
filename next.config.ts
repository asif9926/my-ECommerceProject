import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // 🔥 Facebook এর ছবির জন্য পারমিশন অ্যাড করা হলো
      {
        protocol: "https",
        hostname: "scontent.fjsr13-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
      }
    ],
  },
};

export default nextConfig;