"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, ShieldCheck, Clock, Banknote, Smartphone } from "lucide-react";

export default function PaymentVerifier({ orderId, paymentInfo, paymentStatus }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          paymentStatus: "verified", 
          orderStatus: "Processing" 
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Payment Received & Order Confirmed!");
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Process failed!");
    } finally {
      setLoading(false);
    }
  };

  // Condition 1: Jodi payment agei verified thake
  if (paymentStatus === 'verified') {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-sm">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="text-emerald-600" size={20} />
          <div>
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Payment Paid</p>
            <p className="text-[9px] text-emerald-600 font-mono">Verified Transaction</p>
          </div>
        </div>
        {paymentInfo?.method === 'instant' && (
          <div className="pt-3 border-t border-emerald-200/50 space-y-1">
            <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight flex justify-between">
              <span>Medium:</span> <span>{paymentInfo.gateway}</span>
            </p>
            <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight flex justify-between">
              <span>TrxID:</span> <span className="font-mono">{paymentInfo.transactionId}</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Condition 2: Instant Payment (bKash/Nagad/Rocket)
  if (paymentInfo?.method === 'instant') {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-sm">
          {/* Payment Method/Medium Section */}
          <div className="flex justify-between items-center text-[11px] mb-3 pb-2 border-b border-amber-200/50">
            <span className="text-amber-700 uppercase font-black tracking-tighter flex items-center gap-1">
              <Smartphone size={12} /> Payment Medium
            </span>
            <span className="font-black text-gray-900 uppercase bg-[#d4a843]/10 px-2 py-0.5 rounded border border-[#d4a843]/20">
              {paymentInfo.gateway || 'Mobile Banking'}
            </span>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between text-[11px]">
              <span className="text-gray-500 uppercase font-bold">Account No:</span>
              <span className="font-bold text-gray-900">{paymentInfo.mobileNumber}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500 uppercase font-bold tracking-tight text-[10px]">Transaction ID:</span>
              <span className="font-mono font-black text-gray-900 bg-white px-2 rounded shadow-sm border border-amber-200">
                {paymentInfo.transactionId}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleVerify}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#d4a843] text-white py-3 rounded-sm text-xs font-bold hover:bg-[#b88e33] transition-all disabled:opacity-50 shadow-md uppercase tracking-widest"
        >
          <ShieldCheck size={16} /> Approve {paymentInfo.gateway || 'Payment'}
        </button>
      </div>
    );
  }

  // Condition 3: COD Payment
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm flex items-center gap-3">
        <Clock className="text-gray-400" size={18} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Unpaid (Cash on Delivery)</span>
      </div>
      <button 
        onClick={handleVerify}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-sm text-xs font-bold hover:bg-black transition-all shadow-md uppercase tracking-widest"
      >
        <Banknote size={16} /> Mark as Paid
      </button>
    </div>
  );
}