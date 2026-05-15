import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 🔥 Edge-safe টোকেন চেকিং (Mongoose ছাড়া)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production", // প্রোডাকশনের কুকি যেন ধরতে পারে
  });
  
  const { pathname } = req.nextUrl;

  // রুল ১: লগইন করা ইউজার যেন আবার Auth পেজে (login/register) যেতে না পারে
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/verify");
  
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // রুল ২: লগইন ছাড়া কেউ যেন প্রোফাইল বা চেকআউটে যেতে না পারে
  if (!token && (pathname.startsWith("/profile") || pathname.startsWith("/checkout"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // রুল ৩: অ্যাডমিন প্যানেলের হাই-সিকিউরিটি
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); 
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/checkout/:path*", "/admin/:path*", "/login", "/register", "/forgot-password", "/verify"],
};