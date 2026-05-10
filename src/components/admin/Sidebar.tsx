"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  // মেনুর আইটেমগুলো একটি লিস্টে রাখা হলো যাতে কোড ক্লিন থাকে
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#141414] text-white min-h-screen flex flex-col font-['Inter']">
      <div className="p-6 border-b border-[#2a2a2a]">
        <Link href="/" className="font-['Syne'] text-2xl font-bold tracking-tighter text-[#e8e8e8]">
          BRAND<span className="text-[#d4a843]">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // চেক করা হচ্ছে বর্তমান URL এই মেনুর লিংকের সাথে মেলে কি না
          // ড্যাশবোর্ডের জন্য exact match, বাকিগুলোর জন্য startsWith (যাতে /admin/products/new পেজে থাকলেও Products হাইলাইট হয়)
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname?.startsWith(item.href);

          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${
                isActive 
                  ? "bg-[#d4a843] text-black" // অ্যাকটিভ থাকলে হলুদ ব্যাকগ্রাউন্ড
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white" // অ্যাকটিভ না থাকলে নরমাল
              }`}
            >
              <Icon size={20} /> {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a2a2a]">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-red-400 hover:bg-red-400/10 transition-colors text-left">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}