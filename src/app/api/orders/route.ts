import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; 
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({})
      .populate({ path: "user", model: User, select: "name email" })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    const body = await req.json();

    const orderData = {
      ...body,
      user: session?.user ? (session.user as any).id : null,
      paymentStatus: body.paymentInfo?.method === 'instant' ? 'pending_verification' : 'unpaid'
    };

    const order = await Order.create(orderData);

    // 🔥 ==========================================
    // EMAIL NOTIFICATION SYSTEM (BREVO API)
    // ==========================================
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        const senderEmail = "jihad2080k@gmail.com"; // আপনার Brevo তে ভেরিফাই করা ইমেইল
        const adminEmail = "imtiazzaman02@gmail.com"; // যে ইমেইলে আপনি অর্ডারের নোটিফিকেশন পেতে চান
        
        // কাস্টমার যদি ইমেইল না দেয়, তবে সেশন থেকে নেবে (লগইন করা থাকলে)
        const customerEmail = body.shippingInfo?.email || session?.user?.email;
        const customerName = body.shippingInfo?.firstName + " " + body.shippingInfo?.lastName;
        const orderIdShort = order._id.toString().substring(order._id.toString().length - 6).toUpperCase();

        const headers = {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": brevoApiKey
        };

        // ─── ১. কাস্টমারকে ইনভয়েস মেইল পাঠানো ───
        if (customerEmail) {
          await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers,
            body: JSON.stringify({
              sender: { name: "Twille", email: senderEmail },
              to: [{ email: customerEmail, name: customerName }],
              subject: `Order Confirmation - #${orderIdShort}`,
              htmlContent: `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
                  <div style="background-color: #000; padding: 20px; text-align: center;">
                    <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Twille</h1>
                  </div>
                  <div style="padding: 30px; background-color: #ffffff;">
                    <h2 style="color: #333; margin-top: 0;">Hi ${body.shippingInfo.firstName},</h2>
                    <p style="color: #555; font-size: 16px;">Thank you for your order! We've received it and will start preparing it right away.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 25px 0;">
                      <p style="margin: 5px 0; color: #333;"><strong>Order ID:</strong> #${orderIdShort}</p>
                      <p style="margin: 5px 0; color: #333;"><strong>Payment Method:</strong> ${body.paymentInfo?.method.toUpperCase()}</p>
                      <p style="margin: 5px 0; color: #333; font-size: 18px;"><strong>Total Bill:</strong> ৳${body.totalPrice}</p>
                    </div>

                    <p style="color: #555; font-size: 14px; text-align: center; margin-bottom: 20px;">
                      You can check your order status or details anytime by visiting your profile.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://twille.vercel.app/profile" style="background-color: #d4a843; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">View My Profile</a>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    
                    <p style="color: #777; font-size: 14px; text-align: center; margin-bottom: 15px;">Need help with your order?</p>
                    <div style="text-align: center;">
                      <a href="https://wa.me/8801754336668" style="display: inline-block; background-color: #25D366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 13px; font-weight: bold; margin: 0 5px;">Message on WhatsApp</a>
                      <a href="https://www.facebook.com/twilleofficial" style="display: inline-block; background-color: #1877F2; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 13px; font-weight: bold; margin: 0 5px;">Visit Facebook Page</a>
                    </div>
                  </div>
                </div>
              `
            })
          });
        }

        // ─── ২. অ্যাডমিনকে নতুন অর্ডারের অ্যালার্ট মেইল পাঠানো ───
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers,
          body: JSON.stringify({
            sender: { name: "Twille System", email: senderEmail },
            to: [{ email: adminEmail, name: "Admin" }],
            subject: `🎉 New Order Received! (#${orderIdShort})`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; border-radius: 5px;">
                <h2 style="color: #28a745;">New Order Alert!</h2>
                <p>You have received a new order on Twille.</p>
                <hr />
                <p><strong>Order ID:</strong> #${orderIdShort}</p>
                <p><strong>Customer Name:</strong> ${customerName}</p>
                <p><strong>Phone:</strong> ${body.shippingInfo.phone}</p>
                <p><strong>Address:</strong> ${body.shippingInfo.address}, ${body.shippingInfo.city}</p>
                <hr />
                <p><strong>Payment Method:</strong> ${body.paymentInfo.method.toUpperCase()}</p>
                <p><strong>Total Bill:</strong> <span style="color: #d4a843; font-size: 20px; font-weight: bold;">৳${body.totalPrice}</span></p>
                <p style="margin-top: 20px;">Please check the Admin Panel for full details.</p>
              </div>
            `
          })
        });

      } catch (emailError) {
        console.error("Failed to send order emails:", emailError);
      }
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, message: "Failed to place order" }, { status: 500 });
  }
}