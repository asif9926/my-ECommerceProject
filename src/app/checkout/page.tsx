"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, CheckCircle2, Zap, Tag, ShoppingBag, ShieldCheck, ArrowRight, Info } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  // ── ADMIN SETTINGS STATE ──
  const [shippingRules, setShippingRules] = useState({
    insideDhaka: 60,     
    outsideDhaka: 120,   
    freeShippingThreshold: 2000 
  });

  const [paymentSettings, setPaymentSettings] = useState({
    bKash: "017XXXXXXXX",
    Nagad: "016XXXXXXXX",
    Rocket: "019XXXXXXXX",
    instructions: "Enter your Name in the Reference section."
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "Dhaka", 
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [instantData, setInstantData] = useState({
    gateway: "bKash",
    mobileNumber: "",
    transactionId: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // ── FETCH SETTINGS FROM ADMIN ──
  useEffect(() => {
    setMounted(true);
    const fetchSettings = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/admin/settings?t=${timestamp}`, { cache: "no-store" });
        const data = await res.json();
        
        if (data.success && data.settings) {
          const s = data.settings;
          
          let inside = 60, outside = 120, threshold = 0;
          if (s.shipping) {
             inside = s.shipping.insideDhaka || s.shipping.insideDhakaCharge || 60;
             outside = s.shipping.outsideDhaka || s.shipping.outsideDhakaCharge || 120;
             threshold = s.shipping.freeShippingThreshold || 0;
          } else {
             inside = s.insideDhaka || s.insideDhakaCharge || 60;
             outside = s.outsideDhaka || s.outsideDhakaCharge || 120;
             threshold = s.freeShippingThreshold || 0;
          }

          setShippingRules({
            insideDhaka: Number(inside),
            outsideDhaka: Number(outside),
            freeShippingThreshold: Number(threshold)
          });
          
          let bkash = "017XXXXXXXX", nagad = "016XXXXXXXX", rocket = "019XXXXXXXX", inst = "Enter your Name in the Reference section.";
          
          if (s.payment) {
             bkash = s.payment.bkashNumber || s.payment.bKashNumber || bkash;
             nagad = s.payment.nagadNumber || s.payment.NagadNumber || nagad;
             rocket = s.payment.rocketNumber || s.payment.RocketNumber || rocket;
             inst = s.payment.instructions || s.payment.paymentInstructions || inst;
          } else {
             bkash = s.bkashNumber || s.bKashNumber || bkash;
             nagad = s.nagadNumber || s.NagadNumber || nagad;
             rocket = s.rocketNumber || s.RocketNumber || rocket;
             inst = s.instructions || s.paymentInstructions || inst;
          }

          setPaymentSettings({
            bKash: bkash,
            Nagad: nagad,
            Rocket: rocket,
            instructions: inst
          });
        }
      } catch (error) {
        console.error("Failed to load admin settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // 🔥 Loading Spinner add kora holo jate sada screen na ashe
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#d4a843] rounded-full animate-spin"></div>
      </div>
    );
  }

  // ── DYNAMIC BILL CALCULATION ──
  const subtotal = getTotalPrice();
  const isDhaka = formData.city.toLowerCase() === "dhaka";
  const baseShippingCharge = isDhaka ? shippingRules.insideDhaka : shippingRules.outsideDhaka;
  
  const isFreeShipping = shippingRules.freeShippingThreshold > 0 && subtotal >= shippingRules.freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : baseShippingCharge;
                    
  // 🔥 Math.max add kora holo jeno total kokhono negative na hoy
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInstantDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInstantData({ ...instantData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderAmount: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscountAmount(data.discountAmount);
        toast.success(data.message || "Coupon Applied! 🎁");
      } else {
        setDiscountAmount(0);
        toast.error(data.message || "Invalid Coupon");
      }
    } catch (error) {
      toast.error("Error applying coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (paymentMethod === "instant" && (!instantData.mobileNumber || !instantData.transactionId)) {
      toast.error("Please provide Mobile Number and TrxID");
      setLoading(false);
      return;
    }
    try {
      const orderData = {
        shippingInfo: formData,
        orderItems: items.map((item: any) => ({
          product: item.id || item._id, // 🔥 CRITICAL FIX: Backend er jonno Product ID pathano holo
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.discountPrice || item.price,
          size: item.size,
          color: item.color
        })),
        paymentInfo: {
          method: paymentMethod,
          ...(paymentMethod === "instant" && {
            gateway: instantData.gateway,
            mobileNumber: instantData.mobileNumber,
            transactionId: instantData.transactionId
          })
        },
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      };
      
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        clearCart(); 
        toast.success("Order Placed Successfully! 🎉");
        router.push("/success"); 
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <ShoppingBag size={64} strokeWidth={1} className="text-gray-200 mb-6" />
        <h2 className="text-xl font-serif font-bold text-gray-900 uppercase tracking-widest mb-4">Your bag is empty</h2>
        <Link href="/products" className="px-8 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#d4a843] transition-colors shadow-sm">Continue Shopping</Link>
      </div>
    );
  }

  const activePaymentNumber = instantData.gateway === "bKash" ? paymentSettings.bKash : instantData.gateway === "Nagad" ? paymentSettings.Nagad : paymentSettings.Rocket;

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      
      <div className="border-b border-gray-100 pb-6 mb-8 md:mb-12">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="font-['Syne'] text-2xl font-black tracking-tighter text-black">Twille Checkout<span className="text-[#d4a843]">.</span></Link>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><ShieldCheck size={14} /> Secure Checkout</div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <form onSubmit={handlePlaceOrder} id="checkout-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-12">
            <div><Link href="/cart" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"><ArrowLeft size={14} /> Back to Cart</Link></div>

            {/* ── STEP 1: SHIPPING ── */}
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <h2 className="text-lg font-serif font-bold text-gray-900 tracking-tight">Shipping Information</h2>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-sm focus:border-black outline-none text-sm" placeholder="First Name *" />
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-sm focus:border-black outline-none text-sm" placeholder="Last Name *" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-sm focus:border-black outline-none text-sm" placeholder="Phone Number *" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-sm focus:border-black outline-none text-sm" placeholder="Email (Optional)" />
                </div>
                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-sm focus:border-black outline-none text-sm" placeholder="Full Delivery Address *" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <select required name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-sm focus:border-black outline-none text-sm bg-white cursor-pointer">
                    <option value="Dhaka">Inside Dhaka</option>
                    <option value="Outside Dhaka">Outside Dhaka</option>
                  </select>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full p-3.5 border border-gray-200 rounded-sm focus:border-black outline-none text-sm" placeholder="Postal Code" />
                </div>
              </div>
            </section>

            {/* ── STEP 2: PAYMENT ── */}
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <h2 className="text-lg font-serif font-bold text-gray-900 tracking-tight">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <label className={`block border rounded-sm p-5 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-black w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2"><Truck size={14} className={paymentMethod === 'cod' ? 'text-[#d4a843]' : 'text-gray-400'} /> Cash on Delivery</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">Pay with cash when your order is delivered.</span>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 size={18} className="text-[#d4a843]" />}
                  </div>
                </label>

                <label className={`block border rounded-sm p-5 cursor-pointer transition-all ${paymentMethod === 'instant' ? 'border-green-600 bg-green-50/50 ring-1 ring-green-600' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="instant" checked={paymentMethod === 'instant'} onChange={() => setPaymentMethod('instant')} className="accent-green-600 w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className={paymentMethod === 'instant' ? 'text-green-600' : 'text-gray-400'} /> Mobile Banking</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">Pay instantly via bKash, Nagad or Rocket.</span>
                      </div>
                    </div>
                    {paymentMethod === 'instant' && <CheckCircle2 size={18} className="text-green-600" />}
                  </div>
                  
                  {paymentMethod === 'instant' && (
                    <div className="mt-6 pt-5 border-t border-green-200">
                      <div className="bg-white p-4 rounded-sm border border-green-100 mb-5 shadow-sm">
                        <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-2 flex items-center gap-1.5"><Info size={12} className="text-green-600" /> Instructions</p>
                        <p className="text-xs text-gray-600 leading-relaxed mb-3">Send Money (Personal) to the number below:</p>
                        <p className="text-xl font-black text-green-700 tracking-wider mb-3">{activePaymentNumber}</p>
                        <p className="text-[11px] text-gray-500 italic bg-gray-50 p-2 border-l-2 border-green-600">
                          {paymentSettings.instructions}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select name="gateway" value={instantData.gateway} onChange={handleInstantDataChange} className="w-full p-3 border border-gray-300 rounded-sm text-sm bg-white cursor-pointer">
                          <option value="bKash">bKash</option>
                          <option value="Nagad">Nagad</option>
                          <option value="Rocket">Rocket</option>
                        </select>
                        <input type="text" name="mobileNumber" value={instantData.mobileNumber} onChange={handleInstantDataChange} className="w-full p-3 border border-gray-300 rounded-sm text-sm" placeholder="Sender Number *" required={paymentMethod === 'instant'} />
                        <input type="text" name="transactionId" value={instantData.transactionId} onChange={handleInstantDataChange} className="w-full p-3 border border-gray-300 rounded-sm text-sm uppercase sm:col-span-2" placeholder="Transaction ID (TrxID) *" required={paymentMethod === 'instant'} />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDE: ORDER SUMMARY ── */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 border border-gray-100 rounded-sm p-6 lg:p-8 lg:sticky lg:top-28">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 pb-4 border-b border-gray-200">Order Summary</h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {items.map((item: any) => (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="relative w-14 h-18 bg-white border border-gray-100 rounded-sm overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-1 ring-white">{item.quantity}</span>
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider line-clamp-1">{item.name}</h4>
                      <p className="text-[9px] text-gray-500 font-medium uppercase mt-1">{item.size !== "Default" && `Size: ${item.size}`} {item.color !== "Default" && `| Color: ${item.color}`}</p>
                    </div>
                    <div className="flex items-center"><p className="text-[11px] font-black text-gray-900">৳{(item.discountPrice || item.price) * item.quantity}</p></div>
                  </div>
                ))}
              </div>

              <div className="mb-8 pb-6 border-b border-gray-200">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-3"><Tag size={12} /> Apply Discount Code</label>
                <div className="flex gap-2">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Code" className="flex-grow border border-gray-200 px-4 py-3 text-sm rounded-sm outline-none uppercase focus:border-black transition-colors" disabled={discountAmount > 0} />
                  <button type="button" onClick={handleApplyCoupon} disabled={isApplyingCoupon || discountAmount > 0 || !couponCode} className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 hover:bg-[#d4a843] transition-colors">{isApplyingCoupon ? '...' : (discountAmount > 0 ? 'Applied' : 'Apply')}</button>
                </div>
              </div>

              <div className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="text-gray-900">৳{subtotal}</span></div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping {isDhaka ? <span className="text-[9px] text-gray-400 lowercase">(dhaka)</span> : <span className="text-[9px] text-gray-400 lowercase">(outside)</span>}</span>
                  <span className="text-gray-900">{shipping === 0 ? "Free" : `৳${shipping}`}</span>
                </div>
                {discountAmount > 0 && <div className="flex justify-between text-[#d4a843]"><span>Discount</span><span>-৳{discountAmount}</span></div>}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-2"><span className="text-sm text-gray-900">Total</span><span className="text-2xl font-black text-gray-900">৳{total}</span></div>
              </div>

              <button type="submit" form="checkout-form" disabled={loading} className="w-full mt-8 h-14 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm transition-colors flex items-center justify-center gap-2 hover:bg-[#d4a843] shadow-xl disabled:opacity-70">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Complete Order <ArrowRight size={16} strokeWidth={1.5} /></>}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}