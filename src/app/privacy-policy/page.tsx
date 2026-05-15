import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-['Syne'] tracking-tighter uppercase text-gray-900">
            Privacy <span className="text-[#d4a843] font-serif italic font-normal">Policy</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="space-y-12 text-gray-600">
          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-3">
              <Lock className="text-[#d4a843]" size={20} /> Data Security
            </h2>
            <p className="text-sm leading-relaxed">
              Twille apnar personal data (Name, Phone, Address) er shorboccho nira-potta nishchit kore. 
              Amra kokhono-i apnar data kono third-party-er kache bikri ba share kori na.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4">How we use your info?</h2>
            <p className="text-sm leading-relaxed">
              Apnar data shudhu matro order delivery, official announcement ebong apnar shopping experience 
              aro bhalo korar jonno byabohar kora hoy.
            </p>
          </section>

          <div className="p-8 border border-dashed border-gray-200 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Your trust is our standard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}