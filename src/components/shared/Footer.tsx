import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pt-16 pb-8 font-['Inter']">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="font-['Syne'] text-2xl font-bold tracking-tighter text-gray-900 mb-4 inline-block">
              BRAND<span className="text-[#d4a843]">NAME</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Premium clothing brand offering the best quality and exclusive designs for modern fashion enthusiasts.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Shop</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link href="/products?category=men" className="hover:text-[#d4a843] transition-colors">Men's Collection</Link></li>
              <li><Link href="/products?category=women" className="hover:text-[#d4a843] transition-colors">Women's Collection</Link></li>
              <li><Link href="/products?sort=new" className="hover:text-[#d4a843] transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-[#d4a843] transition-colors">Flash Sale</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link href="/contact" className="hover:text-[#d4a843] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#d4a843] transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-[#d4a843] transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/track-order" className="hover:text-[#d4a843] transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">Subscribe to get special offers and updates.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-l-md focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843] transition-all"
              />
              <button className="bg-[#d4a843] text-white px-4 py-2 rounded-r-md font-semibold hover:bg-[#c2983b] transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Your Brand. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#d4a843] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#d4a843] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}