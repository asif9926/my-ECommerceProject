import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; // User model proyojon join korar jonno

export async function GET() {
  try {
    await connectDB();
    
    const customers = await Order.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: { $ifNull: ["$user", "$shippingInfo.phone"] }, 
          uid: { $last: "$user" }, 
          firstName: { $last: "$shippingInfo.firstName" },
          lastName: { $last: "$shippingInfo.lastName" },
          phone: { $last: "$shippingInfo.phone" },
          shippingEmail: { $last: "$shippingInfo.email" }, // Shipping email-ti backup hishebe rakhlam
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          totalPaid: { 
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "verified"] }, "$totalPrice", 0]
            }
          },
          lastOrder: { $last: "$createdAt" }
        }
      },
      // 🔥 Users collection-er shathe join kora holo Account Email anar jonno
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "_id",
          as: "accountDetails"
        }
      },
      {
        $project: {
          _id: 1,
          name: { $concat: ["$firstName", " ", "$lastName"] },
          phone: 1,
          totalOrders: 1,
          totalSpent: 1,
          totalPaid: 1,
          lastOrder: 1,
          // 🔥 Fallback Logic: Account email thakle sheta, naile shipping email
          email: { 
            $ifNull: [ { $arrayElemAt: ["$accountDetails.email", 0] }, "$shippingEmail" ] 
          }
        }
      },
      { $sort: { lastOrder: -1 } }
    ]);

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}