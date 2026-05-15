import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    const emailDomain = email.split("@")[1]?.toLowerCase();
    
    if (!allowedDomains.includes(emailDomain)) {
      return NextResponse.json({ message: "Please use a valid email domain (e.g., @gmail.com, @outlook.com)." }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "This email is already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 ১. ৬-ডিজিটের র‍্যান্ডম OTP তৈরি করা
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 🔥 ২. OTP এর মেয়াদ ১৫ মিনিট সেট করা
    const verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); 

    // ডাটাবেসে ইউজার এবং OTP সেভ করা
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      verifyCode,
      verifyCodeExpiry
    });

    // 🔥 ৩. Brevo API দিয়ে ইমেইল (OTP) পাঠানো
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
       await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": brevoApiKey
        },
        body: JSON.stringify({
          // 👇 আপনার যে ইমেইল দিয়ে Brevo একাউন্ট খোলা, সেটা ekhane boshate paren 👇
          sender: { name: "Twille", email: "jihad2080k@gmail.com" }, 
          to: [{ email: email, name: name }],
          subject: "Your Twille Verification Code",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 5px;">
              <h2 style="color: #000; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Twille</h2>
              <p style="color: #555; font-size: 16px;">Hello <strong>${name}</strong>,</p>
              <p style="color: #555; font-size: 16px;">Thank you for registering at Twille. Please use the following 6-digit code to verify your email address:</p>
              <div style="background-color: #fafafa; padding: 20px; text-align: center; margin: 30px 0; border: 1px dashed #ddd;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #d4a843;">${verifyCode}</span>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `
        })
      });
    }

    // Success response
    return NextResponse.json({ message: "Registration successful! Please check your email." }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
  }
}