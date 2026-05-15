import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Visitor from "@/models/Visitor";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // lean() ebong Fresh Query
    const orders = await Order.find({}).sort({ createdAt: -1 });

    const totalRevenue = orders.reduce((acc, order: any) => acc + (Number(order.totalPrice) || 0), 0);
    const paidOrders = orders.filter((order: any) => order.paymentStatus === 'verified');
    const receivedPayment = paidOrders.reduce((acc, order: any) => acc + (Number(order.totalPrice) || 0), 0);

    const totalOrders = orders.length;
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "user" });

    // Recent 10 orders (Layout boro korar jonno count barano hoyeche)
    const recentOrders = orders.slice(0, 10).map((order: any) => ({
      id: `#ORD-${order._id?.toString().slice(-4).toUpperCase() || '0000'}`,
      customer: `${order.shippingInfo?.firstName || 'Guest'} ${order.shippingInfo?.lastName || ''}`.trim(),
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Unknown',
      amount: `৳${Number(order.totalPrice) || 0}`,
      status: order.paymentStatus === 'verified' ? 'Verified' : 'Unpaid'
    }));

    // Visitor stats calculation
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const todayData = await Visitor.findOne({ date: todayStr }).catch(() => null);
    const allVisitors = await Visitor.find({}).catch(() => []);
    const totalVisitors = allVisitors.reduce((acc: any, v: any) => acc + (v.count || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue, receivedPayment, totalOrders, totalProducts, totalCustomers,
        todayVisitors: todayData ? todayData.count : 0,
        totalVisitors, recentOrders
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}