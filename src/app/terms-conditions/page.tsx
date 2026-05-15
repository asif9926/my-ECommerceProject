import Link from "next/link";
import { ChevronRight, Scale } from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">Terms & Conditions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-['Syne'] tracking-tighter uppercase text-gray-900">
            Terms <span className="text-[#d4a843] font-serif italic font-normal">& Conditions</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="space-y-12 text-gray-600">
          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4">1. General Overview</h2>
            <p className="text-sm leading-relaxed">
              Twille website-ti byabohar korar maddhome apni amader terms gulo mene nichechen bole dhore neya hobe. 
              Amra jekono somoy ei terms gulo update korar odhikar rakhi.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4">2. Product Accuracy</h2>
            <p className="text-sm leading-relaxed">
              Amra protita product-er original color ebong details dekhate shorboccho chesta kori. 
              Tobe apnar device-er display settings-er karone color ektu ekh-odikh hote pare.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4">3. Pricing & Payment</h2>
            <p className="text-sm leading-relaxed">
              Product-er dam jekono somoy change hote pare. Cash on Delivery ba Online payment—ubhoy khetrei order confirm howar por dam fixed thakbe.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}