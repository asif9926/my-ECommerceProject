"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // 🔥 Step 1: Email সেন্ড করার ফাংশন
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("OTP sent to your email!");
        setStep(2); // OTP বক্স দেখানোর জন্য Step 2 তে চলে যাবে
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Step 2: নতুন পাসওয়ার্ড সেভ করার ফাংশন
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(3); // Success স্ক্রিন দেখাবে
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (step === 3) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center space-y-4 bg-white p-12 rounded-xl shadow-sm border border-gray-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 font-['Syne']">Password Reset!</h2>
          <p className="text-gray-500 text-sm">Your password has been changed successfully. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-['Syne']">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1 
              ? "Enter your email to receive a reset code." 
              : `We sent a code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}
        {success && step === 2 && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-md mb-6 text-center">
            {success}
          </div>
        )}

        {/* ─── STEP 1: EMAIL FORM ─── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843]"
                placeholder="user@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#d4a843] hover:bg-[#c2983b] text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50 mt-4 shadow-sm"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* ─── STEP 2: OTP & NEW PASSWORD FORM ─── */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5 text-center">Enter 6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center text-2xl tracking-[0.5em] font-bold bg-white border border-gray-300 text-gray-900 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843]"
                placeholder="------"
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-1.5">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843]"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6 || newPassword.length < 6}
              className="w-full bg-[#d4a843] hover:bg-[#c2983b] text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50 mt-4 shadow-sm"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors font-medium">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}