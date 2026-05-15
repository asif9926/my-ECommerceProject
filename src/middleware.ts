import { NextResponse } from "next/server";
import { auth } from "@/auth"; // 🔥 Auth.js v5-এর আসল নিয়ম

export default auth((req) => {
  // req.auth এর ভেতরে ইউজারের সব ডাটা (টোকেন) থাকে
  const token = req.auth;
  const { pathname } = req.nextUrl;

  // 🔥 রুল ১: লগইন করা ইউজার যেন আবার Auth পেজে (login/register) যেতে না পারে
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
    // token.user.role চেক করতে হবে v5 এর নিয়মে
    if ((token.user as any)?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); 
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/profile/:path*", "/checkout/:path*", "/admin/:path*", "/login", "/register", "/forgot-password", "/verify"],
};