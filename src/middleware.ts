import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // ইউজারের লগইন টোকেন চেক করা হচ্ছে
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // রুল ১: যদি ইউজার লগইন করা না থাকে এবং প্রোফাইল বা চেকআউট পেজে যেতে চায়, তাকে লগইন পেজে পাঠাও
  if (!token && (pathname.startsWith("/profile") || pathname.startsWith("/checkout"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // রুল ২: অ্যাডমিন প্যানেলের সিকিউরিটি
  if (pathname.startsWith("/admin")) {
    // লগইন করা না থাকলে লগইন পেজে পাঠাও
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // লগইন করা আছে, কিন্তু সে 'admin' নয় (সাধারণ কাস্টমার), তাকে হোমপেজে পাঠিয়ে দাও
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); 
    }
  }

  // সব ঠিক থাকলে পেজে ঢুকতে দাও
  return NextResponse.next();
}

// কোন কোন লিংকের জন্য এই সিকিউরিটি গার্ড (Middleware) কাজ করবে, তা এখানে বলে দেওয়া হলো
export const config = {
  matcher: ["/profile/:path*", "/checkout/:path*", "/admin/:path*"],
};