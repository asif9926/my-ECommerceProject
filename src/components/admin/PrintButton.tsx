"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm print:hidden"
    >
      <Printer size={16} /> Print Invoice
    </button>
  );
}