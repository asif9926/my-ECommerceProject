"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🔥 ১. Password Minimum 6 Digits Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // 🔥 ২. Verified Email Domain Validation
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    const emailDomain = email.split("@")[1]?.toLowerCase();
    
    if (!allowedDomains.includes(emailDomain)) {
      setError("Please use a valid email domain (e.g., @gmail.com, @outlook.com).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

if (res.ok) {
        // অ্যাকাউন্ট তৈরি হলে লগইন না করিয়ে সরাসরি ভেরিফাই পেজে রিডাইরেক্ট করা হচ্ছে
        // সাথে ইউজারের ইমেইলটিও URL এ পাঠিয়ে দেওয়া হচ্ছে যাতে ভেরিফাই পেজে ইমেইলটা শো করে
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter font-['Syne']">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500 uppercase tracking-widest font-bold">
            Join the premium club
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all"
                placeholder="you@gmail.com"
              />
            </div>
            <div className="relative">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4a843] hover:bg-[#c2983b] text-white text-[11px] uppercase tracking-widest font-bold py-3 rounded-md transition-colors disabled:opacity-50 mt-4 shadow-sm"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* 🔥 ৩. Continue with Google Button */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 text-[11px] uppercase tracking-widest font-bold py-3 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>

        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#d4a843] hover:text-black transition-colors border-b border-transparent hover:border-black">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}