"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  // ফর্মের ডেটা ধরে রাখার জন্য স্টেট
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // পেমেন্ট মেথড স্টেট
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod = Cash on Delivery

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // কার্ট খালি থাকলে চেকআউট পেজে ঢুকতে দেবে না, কার্টে পাঠিয়ে দেবে
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link href="/products" className="text-[#d4a843] hover:underline font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 2000 ? 0 : 120;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API তে পাঠানোর জন্য ডেটা সাজানো হচ্ছে
      const orderData = {
        shippingInfo: formData,
        orderItems: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.discountPrice || item.price,
          size: item.size,
          color: item.color
        })),
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      };

      // API তে POST রিকোয়েস্ট পাঠানো
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        clearCart(); // অর্ডার প্লেস হলে কার্ট খালি করে দেওয়া
        toast.success("Order Placed Successfully! 🎉");
        router.push("/"); // হোমপেজে পাঠিয়ে দেওয়া
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors font-medium">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Side: Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Syne']">Shipping Information</h2>
              
              <form onSubmit={handlePlaceOrder} id="checkout-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">First Name *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" placeholder="e.g. Asif" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">Last Name *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" placeholder="e.g. Haque" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" placeholder="01XXX-XXXXXX" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" placeholder="asif@example.com" />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-1.5">Full Delivery Address *</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" placeholder="House/Apartment, Road, Area" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" placeholder="e.g. Dhaka" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">Postal / ZIP Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" placeholder="e.g. 1212" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Syne'] border-t border-gray-200 pt-8">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Cash on Delivery Option */}
                  <label className={`block border rounded-sm p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#d4a843] bg-[#d4a843]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#d4a843] focus:ring-[#d4a843]" />
                        <span className="font-medium text-gray-900 flex items-center gap-2"><Truck size={18} className="text-gray-500" /> Cash on Delivery</span>
                      </div>
                      {paymentMethod === 'cod' && <CheckCircle2 size={20} className="text-[#d4a843]" />}
                    </div>
                  </label>

                  {/* Online Payment Option */}
                  <label className={`block border rounded-sm p-4 cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-[#d4a843] bg-[#d4a843]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-4 h-4 text-[#d4a843] focus:ring-[#d4a843]" />
                        <span className="font-medium text-gray-900 flex items-center gap-2"><CreditCard size={18} className="text-gray-500" /> Online Payment (bKash/Cards)</span>
                      </div>
                      {paymentMethod === 'online' && <CheckCircle2 size={20} className="text-[#d4a843]" />}
                    </div>
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-sm p-6 sticky top-24 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Syne'] border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 rounded-sm shrink-0 overflow-hidden border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} {item.size && `| Size: ${item.size}`}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">৳{(item.discountPrice || item.price) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? "Free" : `৳${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-lg pt-3 border-t border-gray-100 mt-3">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full mt-8 bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Place Order - ৳{total}</>
                )}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} /> Your information is secure
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}