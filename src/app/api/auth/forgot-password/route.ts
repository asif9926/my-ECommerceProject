import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    // ১. চেক করা অ্যাকাউন্ট আছে কি না
    if (!user) {
      return NextResponse.json({ message: "No account found with this email." }, { status: 404 });
    }

    // ২. চেক করা অ্যাকাউন্টটি Google দিয়ে খোলা কি না (কারণ Google account-এ পাসওয়ার্ড থাকে না)
    if (!user.password) {
      return NextResponse.json({ message: "This account uses Google Login. Password reset is not needed." }, { status: 400 });
    }

    // ৩. 6-digit OTP তৈরি করা
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // ১৫ মিনিট মেয়াদ

    // ডাটাবেসে সেভ করা
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetExpiry;
    await user.save();

    // ৪. Brevo দিয়ে ইমেইল পাঠানো
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": brevoApiKey
          },
          body: JSON.stringify({
            // 👇 এখানে আপনার Brevo-তে ভেরিফাই করা আসল ইমেইলটি দেবেন 👇
            sender: { name: "Twille", email: "jihad2080k@gmail.com" }, 
            to: [{ email: user.email, name: user.name }],
            subject: "Twille - Password Reset Code",
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 5px;">
                <h2 style="color: #000; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Twille</h2>
                <p style="color: #555; font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
                <p style="color: #555; font-size: 16px;">We received a request to reset your password. Please use the following 6-digit code:</p>
                <div style="background-color: #fafafa; padding: 20px; text-align: center; margin: 30px 0; border: 1px dashed #ddd;">
                  <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #d4a843;">${resetToken}</span>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center;">This code will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
              </div>
            `
          })
        });
      } catch (emailError) {
        console.error("Brevo Email Error:", emailError);
      }
    }

    return NextResponse.json({ message: "Password reset code sent to your email!" }, { status: 200 });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
  }
}