import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // OTP চেক করা
    if (user.resetPasswordToken !== otp) {
      return NextResponse.json({ message: "Invalid OTP! Please try again." }, { status: 400 });
    }

    // OTP এর মেয়াদ চেক করা (১৫ মিনিট)
    if (new Date() > new Date(user.resetPasswordExpiry)) {
      return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // নতুন পাসওয়ার্ড হ্যাশ করে সেভ করা
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // সিকিউরিটির জন্য OTP মুছে দেওয়া
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
  }
}