"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Ruler, Scissors, ArrowRight, UserCheck } from "lucide-react";

export default function SizeFinderPage() {
  const [activeGender, setActiveGender] = useState("men");
  
  // Calculator States (Only FT/IN and KG)
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState("regular");
  const [isCalculating, setIsCalculating] = useState(false);
  const [suggestedSize, setSuggestedSize] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heightFt || !weight) return;
    
    setIsCalculating(true);
    setSuggestedSize(null);

    setTimeout(() => {
      const w = parseFloat(weight);
      const totalInches = (parseInt(heightFt) * 12) + (parseInt(heightIn) || 0);
      
      let size = "M";
      
      // 🔥 Advanced logic optimized for Bangladeshi demographics
      if (activeGender === "men") {
        if (w < 52) size = "S";
        else if (w >= 52 && w < 62) size = (totalInches >= 68) ? "M" : "S"; // 5'8"
        else if (w >= 62 && w < 72) size = (totalInches >= 70) ? "L" : "M"; // 5'10"
        else if (w >= 72 && w < 82) size = (totalInches >= 71) ? "XL" : "L"; // 5'11"
        else if (w >= 82 && w < 92) size = "XL";
        else size = "XXL";
      } else {
        // Women
        if (w < 45) size = "S";
        else if (w >= 45 && w < 55) size = (totalInches >= 63) ? "M" : "S"; // 5'3"
        else if (w >= 55 && w < 65) size = (totalInches >= 65) ? "L" : "M"; // 5'5"
        else if (w >= 65 && w < 75) size = (totalInches >= 66) ? "XL" : "L";
        else if (w >= 75 && w < 85) size = "XL";
        else size = "XXL";
      }

      // Fit preference adjustment
      if (fit === "loose" && size !== "XXL") {
        const sizes = ["S", "M", "L", "XL", "XXL"];
        const currentIndex = sizes.indexOf(size);
        if (currentIndex !== -1 && currentIndex < sizes.length - 1) {
          size = sizes[currentIndex + 1];
        }
      } else if (fit === "slim" && size !== "S") {
        // Slim fit e ashol size tai thakbe, kintu tite hobe
      }

      setSuggestedSize(size);
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ── HEADER AREA ── */}
      <div className="bg-gray-50 py-12 md:py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">Size Finder</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-['Syne'] tracking-tighter uppercase text-gray-900 flex items-center gap-4">
            Find Your <span className="text-[#d4a843] font-serif italic font-normal text-3xl md:text-5xl">Perfect Fit</span>
          </h1>
          <p className="mt-4 text-xs font-medium text-gray-500 uppercase tracking-widest max-w-xl">
            Use our smart calculator or refer to the size charts below to ensure your pieces fit exactly how you want them to.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* ── LEFT COLUMN: SMART CALCULATOR ── */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Ruler className="text-[#d4a843]" size={24} strokeWidth={1.5} />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Smart Fit Predictor</h2>
          </div>

          <div className="bg-gray-50 p-8 md:p-10 border border-gray-100 rounded-sm relative overflow-hidden">
            {/* Background design accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/50 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <form onSubmit={handleCalculate} className="relative z-10">
              
              {/* Gender Toggle Only (Unit toggle removed) */}
              <div className="flex items-center justify-start mb-8">
                <div className="flex items-center p-1 bg-white border border-gray-200 rounded-sm">
                  <button type="button" onClick={() => setActiveGender("men")} className={`px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm ${activeGender === "men" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>Men</button>
                  <button type="button" onClick={() => setActiveGender("women")} className={`px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm ${activeGender === "women" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>Women</button>
                </div>
              </div>

              {/* Inputs (Fixed FT/IN & KG) */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Height Input (FT & IN) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Height (FT & IN)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      required
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="Ft (e.g. 5)"
                      className="w-1/2 bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a843] transition-colors rounded-sm"
                    />
                    <input 
                      type="number" 
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="In (e.g. 8)"
                      className="w-1/2 bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a843] transition-colors rounded-sm"
                    />
                  </div>
                </div>

                {/* Weight Input (KG) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Weight (KG)</label>
                  <input 
                    type="number" 
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a843] transition-colors rounded-sm"
                  />
                </div>
              </div>

              {/* Fit Preference */}
              <div className="mb-10">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">How do you prefer your clothes to fit?</label>
                <div className="grid grid-cols-3 gap-3">
                  {["slim", "regular", "loose"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFit(f)}
                      className={`py-3 border text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm ${fit === f ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action & Result */}
              {suggestedSize ? (
                <div className="bg-white border-2 border-[#d4a843] p-6 text-center rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Your Recommended Size</span>
                  <div className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">{suggestedSize}</div>
                  <button type="button" onClick={() => setSuggestedSize(null)} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors border-b border-transparent hover:border-black">Recalculate</button>
                </div>
              ) : (
                <button 
                  type="submit" 
                  disabled={isCalculating}
                  className="w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#d4a843] transition-colors flex items-center justify-center gap-2 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCalculating ? "Calculating..." : <>Find My Size <ArrowRight size={16} strokeWidth={1.5} /></>}
                </button>
              )}

            </form>
          </div>
        </div>

        {/* ── RIGHT COLUMN: HOW TO MEASURE & CHART ── */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Scissors className="text-[#d4a843]" size={24} strokeWidth={1.5} />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">How To Measure</h2>
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-black">1</div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Chest / Bust</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Measure under your arms, around the fullest part of your chest/bust.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-black">2</div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Waist</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Measure around your natural waistline, keeping the tape a bit loose.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-black">3</div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Hips</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Measure around the fullest part of your body at the top of your leg.</p>
              </div>
            </div>
          </div>

          {/* Static Size Chart */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">General Size Chart</h3>
            <span className="text-[9px] font-bold text-[#d4a843] uppercase tracking-widest bg-orange-50 px-2 py-1">Inches</span>
          </div>
          
          <div className="overflow-x-auto border border-gray-100 rounded-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="p-4 border-b border-gray-100">Size</th>
                  <th className="p-4 border-b border-gray-100">Chest</th>
                  <th className="p-4 border-b border-gray-100">Waist</th>
                  <th className="p-4 border-b border-gray-100">Hips</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-gray-700">
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-black">S</td>
                  <td className="p-4">36" - 38"</td>
                  <td className="p-4">30" - 32"</td>
                  <td className="p-4">36" - 38"</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-black">M</td>
                  <td className="p-4">38" - 40"</td>
                  <td className="p-4">32" - 34"</td>
                  <td className="p-4">38" - 40"</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-black">L</td>
                  <td className="p-4">40" - 42"</td>
                  <td className="p-4">34" - 36"</td>
                  <td className="p-4">40" - 42"</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-black">XL</td>
                  <td className="p-4">42" - 44"</td>
                  <td className="p-4">36" - 38"</td>
                  <td className="p-4">42" - 44"</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-sm gap-3">
             <UserCheck size={16} className="text-gray-400" />
             {/* 🔥 Contact Support ar jonno WhatsApp Link Add Kora Holo */}
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
               Still unsure? 
               <a href="https://wa.me/8801754336668?text=Hello%20Twille,%20I%20need%20help%20with%20sizing" target="_blank" rel="noreferrer" className="text-black hover:text-[#d4a843] border-b border-black hover:border-[#d4a843] transition-colors ml-1">
                 Contact Support
               </a>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}