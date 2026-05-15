import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const { target, subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ success: false, message: "Subject and message are required" }, { status: 400 });
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      return NextResponse.json({ success: false, message: "Brevo API key is missing" }, { status: 500 });
    }

    await connectDB();

    let recipients = [];
    if (target === "all") {
      const users = await User.find({ email: { $exists: true, $ne: null } }).select("email name");
      recipients = users.map(u => ({ email: u.email, name: u.name || "Customer" }));
    } else {
      recipients = [{ email: target }];
    }

    if (recipients.length === 0) {
      return NextResponse.json({ success: false, message: "No customers found with valid email." }, { status: 404 });
    }

    // 👇 আপনার Brevo ভেরিফাইড ইমেইলটি এখানে দিন
    const senderEmail = "jihad2080k@gmail.com"; 

    // ইমেইলের বডিতে লাইন ব্রেক (<br>) ঠিক করার লজিক
    const formattedMessage = message.replace(/\n/g, "<br>");

    const brevoPayload: any = {
      sender: { name: "Twille", email: senderEmail },
      subject: subject,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 5px; overflow: hidden;">
          
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Twille</h1>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333; margin-top: 0; font-size: 20px;">${subject}</h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 25px 0; color: #555; font-size: 16px; line-height: 1.6;">
              ${formattedMessage}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://twille.vercel.app/products" style="background-color: #d4a843; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Visit Our Store</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            
            <p style="color: #777; font-size: 14px; text-align: center; margin-bottom: 15px;">Stay Connected With Us</p>
            <div style="text-align: center;">
              <a href="https://wa.me/01754336668" style="display: inline-block; background-color: #25D366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 13px; font-weight: bold; margin: 0 5px 10px 5px;">Message on WhatsApp</a>
              <a href="https://www.facebook.com/twilleofficial/" style="display: inline-block; background-color: #1877F2; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 13px; font-weight: bold; margin: 0 5px 10px 5px;">Visit Facebook Page</a>
            </div>
          </div>
        </div>
      `
    };

    if (target === "all") {
       brevoPayload.to = [{ email: senderEmail, name: "Twille Admin" }];
       brevoPayload.bcc = recipients;
    } else {
       brevoPayload.to = recipients;
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey
      },
      body: JSON.stringify(brevoPayload)
    });

    if (!response.ok) {
        return NextResponse.json({ success: false, message: "Failed to send email via Brevo" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Email(s) sent successfully!" });

  } catch (error) {
    console.error("Email Broadcast Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}