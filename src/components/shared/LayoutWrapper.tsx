"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // চেক করা হচ্ছে URL টা কি /admin দিয়ে শুরু হয়েছে কি না
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {/* যদি অ্যাডমিন রাউট না হয়, তবেই Navbar দেখাবে */}
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow flex flex-col w-full">{children}</main>
      
      {/* যদি অ্যাডমিন রাউট না হয়, তবেই Footer দেখাবে */}
      {!isAdminRoute && <Footer />}
    </>
  );
}