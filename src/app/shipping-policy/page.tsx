import Link from "next/link";
import { Truck, ShieldCheck, ChevronRight } from "lucide-react";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

// 🔥 Next.js-কে বলে দেওয়া হচ্ছে যেন এই পেজটি নির্দিষ্ট সময় পরপর ডাটা রিফ্রেশ করে
export const revalidate = 60;

export default async function ShippingPolicy() {
  // ── ডাটাবেস থেকে ডাইনামিক সেটিংস আনা হচ্ছে ──
  await connectDB();
  const settingsData = await Settings.findOne().lean();

  // ডিফল্ট ভ্যালু সেট করা (যদি অ্যাডমিন প্যানেল থেকে সেট করা না থাকে)
  let insideDhaka = 60;
  let outsideDhaka = 120;
  let freeShippingThreshold = 2000;

  if (settingsData) {
    const s = settingsData as any;
    // ডাটাবেসের ফিল্ডের নাম অনুযায়ী ডাটা এক্সট্র্যাক্ট করা
    if (s.shipping) {
      insideDhaka = s.shipping.insideDhaka || s.shipping.insideDhakaCharge || 60;
      outsideDhaka = s.shipping.outsideDhaka || s.shipping.outsideDhakaCharge || 120;
      freeShippingThreshold = s.shipping.freeShippingThreshold || 2000;
    } else {
      insideDhaka = s.insideDhaka || s.insideDhakaCharge || 60;
      outsideDhaka = s.outsideDhaka || s.outsideDhakaCharge || 120;
      freeShippingThreshold = s.freeShippingThreshold || 2000;
    }
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">Shipping Policy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-['Syne'] tracking-tighter uppercase text-gray-900">
            Shipping <span className="text-[#d4a843] font-serif italic font-normal">Policy</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="prose prose-sm max-w-none text-gray-600 space-y-10">
          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-3">
              <Truck className="text-[#d4a843]" /> Delivery Timeline
            </h2>
            <p className="leading-relaxed">
              Twille-e amra apnar order-ti joto druto somvob pouchate chesta kori. 
              Dhakar vitore amader delivery somoy <strong>2-4 business days</strong> ebong Dhakar baire <strong>5-7 business days</strong>. 
              Festive season ba heavy rain-er somoy ektu somoy besi lagte pare.
            </p>
          </section>

          <section className="bg-gray-50 p-8 border border-gray-100 rounded-sm">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-4">Shipping Charges</h2>
            <ul className="space-y-3 font-medium">
              <li className="flex justify-between border-b border-gray-200 pb-2">
                <span>Inside Dhaka</span>
                {/* 🔥 ডাইনামিক ইনসাইড ঢাকা চার্জ */}
                <span className="text-black">৳{insideDhaka}</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 pb-2">
                <span>Outside Dhaka</span>
                {/* 🔥 ডাইনামিক আউটসাইড ঢাকা চার্জ */}
                <span className="text-black">৳{outsideDhaka}</span>
              </li>
              
              {/* ফ্রি শিপিং যদি 0 এর চেয়ে বেশি হয়, তবেই এটি দেখাবে */}
              {freeShippingThreshold > 0 && (
                <li className="flex justify-between text-[#d4a843] pt-2">
                  {/* 🔥 ডাইনামিক ফ্রি শিপিং অ্যামাউন্ট */}
                  <span>Orders over ৳{freeShippingThreshold}</span>
                  <span className="font-bold uppercase tracking-widest">Free Shipping</span>
                </li>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-3">
              <ShieldCheck className="text-[#d4a843]" /> Order Tracking
            </h2>
            <p className="leading-relaxed">
              Order confirm howar por apni ekta SMS paben. Sathe apnar <Link href="/profile" className="text-black font-bold underline">Profile</Link> section thekeo live status check korte parben.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}