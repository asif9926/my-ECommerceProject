"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function VerifyContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // ৩ সেকেন্ড পর লগইন পেজে ইমেইল সহ পাঠিয়ে দেবে
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }, 3000);
      } else {
        setError(data.message || "Verification failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 font-['Syne']">Verified!</h2>
        <p className="text-gray-500 text-sm">Your email has been verified successfully. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter font-['Syne']">
          Verify Email
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          We sent a 6-digit code to <span className="font-bold text-black">{email || "your email"}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest p-3 rounded-md text-center mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block text-center">Enter 6-Digit Code</label>
          <input
            type="text"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // শুধুমাত্র নাম্বার ইনপুট নেবে
            className="w-full text-center text-3xl tracking-[1em] font-bold bg-white border border-gray-300 text-gray-900 px-4 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all"
            placeholder="------"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-[#d4a843] hover:bg-[#c2983b] text-white text-[11px] uppercase tracking-widest font-bold py-3 rounded-md transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? "Verifying..." : "Verify Now"}
        </button>
      </form>

      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center mt-6">
        Didn't receive the code?{" "}
        <Link href="/register" className="text-[#d4a843] hover:text-black transition-colors">
          Register Again
        </Link>
      </p>
    </>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <Suspense fallback={<div className="text-center text-sm font-bold text-gray-500 uppercase">Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}