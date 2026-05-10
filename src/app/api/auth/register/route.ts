import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // ফ্রন্টএন্ড থেকে পাঠানো ডেটা রিসিভ করা
    const { name, email, password } = await req.json();

    // ভ্যালিডেশন: কোনো ফিল্ড ফাঁকা আছে কি না চেক করা
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
    }

    await connectDB();

    // চেক করা এই ইমেইল দিয়ে আগে কোনো অ্যাকাউন্ট খোলা আছে কি না
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "This email is already registered." }, { status: 400 });
    }

    // পাসওয়ার্ড হ্যাশ (এনক্রিপ্ট) করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // ডেটাবেসে নতুন ইউজার সেভ করা
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
  }
}