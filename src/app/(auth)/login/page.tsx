"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false); // ভুল হলে লোডিং থামিয়ে এরর দেখাবে
      } else {
        // সফল হলে নতুন কুকি নিয়ে সোজা প্রোফাইলে যাবে
        window.location.href = "/profile";
      }
    } catch (err) {
      setError("Something went wrong! Please try again.");
      setLoading(false); // সার্ভারে সমস্যা হলেও লোডিং থামিয়ে এরর দেখাবে
    }
  };
  
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter font-['Syne']">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500 uppercase tracking-widest font-bold">
            Log in to your account
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
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all"
                placeholder="user@example.com"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Password</label>
                <Link href="/forgot-password" className="text-[10px] text-[#d4a843] hover:text-black transition-colors font-bold uppercase tracking-widest">
                  Forgot password?
                </Link>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all"
                placeholder="••••••••"
                autoFocus={!!prefilledEmail}
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

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
            onClick={handleGoogleLogin}
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
          Don't have an account?{" "}
          <Link href="/register" className="text-[#d4a843] hover:text-black transition-colors border-b border-transparent hover:border-black">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-gray-500 uppercase tracking-widest">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}