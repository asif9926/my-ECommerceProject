"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Order status updated successfully!");
        router.refresh(); // পেজ রিফ্রেশ করে নতুন স্ট্যাটাস আনবে
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Network error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="font-bold text-gray-900 mb-3">Update Order Status</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex-grow border border-gray-300 px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#d4a843] text-sm font-medium"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleUpdate}
          disabled={loading || status === currentStatus}
          className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 shadow-sm"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : "Update Status"}
        </button>
      </div>
    </div>
  );
}