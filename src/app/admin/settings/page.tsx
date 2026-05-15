"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Truck, Tag, Plus, Save, Trash2, Image as ImageIcon, CreditCard, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("storefront");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    announcement: { text: "", isActive: true },
    heroBanners: [{ url: "" }],
    shipping: { insideDhaka: 60, outsideDhaka: 120, freeShippingThreshold: 2000 },
    payment: {
      bkashNumber: "017XXXXXXXX",
      nagadNumber: "016XXXXXXXX",
      rocketNumber: "019XXXXXXXX",
      instructions: "Enter your Name in the Reference section."
    },
    popup: {
      isActive: false,
      title: "GET 50% OFF NOW",
      description: "Sign up for our page and get 50% off your first purchase!",
      buttonText: "SHOP SALE NOW",
      link: "/products?sale=true",
      imageUrl: ""
    }
  });

  const [coupons, setCoupons] = useState<any[]>([]);
  // 🔥 FIXED: Here was the syntax error
  const [newCoupon, setNewCoupon] = useState<any>({
    code: "", type: "percentage", value: "", expiryDate: "", minOrderAmt: "", maxUses: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resSettings, resCoupons] = await Promise.all([
        fetch("/api/admin/settings").then(res => res.json()),
        fetch("/api/admin/coupons").then(res => res.json())
      ]);

      if (resSettings.success) {
        setSettings(prev => ({
          ...resSettings.settings,
          payment: { ...prev.payment, ...(resSettings.settings.payment || {}) },
          popup: { ...prev.popup, ...(resSettings.settings.popup || {}) }
        }));
      }
      if (resCoupons.success) setCoupons(resCoupons.coupons);
    } catch (error) {
      toast.error("Failed to load settings data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Coupon created successfully!");
        setCoupons([data.coupon, ...coupons]);
        setNewCoupon({ code: "", type: "percentage", value: "", expiryDate: "", minOrderAmt: "", maxUses: "" });
      } else {
        toast.error(data.message || "Failed to create coupon");
      }
    } catch (error) {
      toast.error("Error creating coupon");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Coupon deleted successfully!");
        setCoupons(coupons.filter(c => c._id !== id));
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
      toast.error("Error deleting coupon");
    }
  };

  if (loading) return <div className="p-10 text-center font-['Syne'] text-gray-500">Loading Configuration...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Syne']">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your storefront, shipping rules, payment details, promotions, and popups.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ── SIDEBAR NAVIGATION ── */}
        <div className="w-full lg:w-64 bg-white border border-gray-200 rounded-sm p-2 flex flex-col gap-1 shrink-0">
          <button onClick={() => setActiveTab("storefront")} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'storefront' ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <SettingsIcon size={18} /> Storefront
          </button>
          
          <button onClick={() => setActiveTab("popup")} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'popup' ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutTemplate size={18} /> Entry Popup
          </button>

          <button onClick={() => setActiveTab("shipping")} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'shipping' ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Truck size={18} /> Shipping Rules
          </button>
          <button onClick={() => setActiveTab("payment")} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'payment' ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <CreditCard size={18} /> Payment Methods
          </button>
          <button onClick={() => setActiveTab("coupons")} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'coupons' ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Tag size={18} /> Coupons & Promos
          </button>
        </div>

        <div className="flex-1 w-full bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          
          {/* ── TAB 1: STOREFRONT ── */}
          {activeTab === "storefront" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-['Syne'] mb-4">Storefront Appearance</h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Top Announcement Bar Text</label>
                <input 
                  type="text" 
                  value={settings.announcement?.text || ""}
                  onChange={(e) => setSettings({...settings, announcement: { ...settings.announcement, text: e.target.value }})}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="E.g. Get 50% Off on Eid Collection!"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={settings.announcement?.isActive || false}
                  onChange={(e) => setSettings({...settings, announcement: { ...settings.announcement, isActive: e.target.checked }})}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <span className="text-sm text-gray-600 cursor-pointer">Show announcement bar on website</span>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">Hero Section Banner Image URL</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center shrink-0 border border-gray-200">
                    <ImageIcon size={20} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={settings.heroBanners?.[0]?.url || ""}
                    onChange={(e) => setSettings({...settings, heroBanners: [{ url: e.target.value }]})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="https://your-cloudinary-image-url.jpg"
                  />
                </div>
              </div>

              <button onClick={handleSaveSettings} disabled={saving} className="mt-6 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-[#d4a843] transition-colors disabled:opacity-50 shadow-sm">
                <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          )}

          {/* ── TAB: ENTRY POPUP ── */}
          {activeTab === "popup" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-['Syne'] mb-4">Entry Popup Modal</h2>
              <p className="text-sm text-gray-500 mb-6">Configure the promotional popup that appears when a user enters the site.</p>
              
              <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6">
                <input 
                  type="checkbox" 
                  checked={settings.popup?.isActive || false}
                  onChange={(e) => setSettings({...settings, popup: { ...settings.popup, isActive: e.target.checked }})}
                  className="w-5 h-5 accent-black cursor-pointer"
                />
                <span className="font-bold text-gray-900 cursor-pointer">Enable Popup Modal on Website</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Popup Title</label>
                  <input 
                    type="text" 
                    value={settings.popup?.title || ""}
                    onChange={(e) => setSettings({...settings, popup: { ...settings.popup, title: e.target.value }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="E.g. GET 50% OFF NOW"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Button Text</label>
                  <input 
                    type="text" 
                    value={settings.popup?.buttonText || ""}
                    onChange={(e) => setSettings({...settings, popup: { ...settings.popup, buttonText: e.target.value }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="E.g. SHOP SALE NOW"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Link (When button is clicked)</label>
                <input 
                  type="text" 
                  value={settings.popup?.link || ""}
                  onChange={(e) => setSettings({...settings, popup: { ...settings.popup, link: e.target.value }})}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="E.g. /products?sale=true"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description / Subtitle</label>
                <textarea 
                  rows={2}
                  value={settings.popup?.description || ""}
                  onChange={(e) => setSettings({...settings, popup: { ...settings.popup, description: e.target.value }})}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="E.g. Don't miss our biggest sale event."
                />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">Popup Image URL</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                    {settings.popup?.imageUrl ? (
                      <img src={settings.popup.imageUrl} alt="Popup preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-gray-400" />
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={settings.popup?.imageUrl || ""}
                    onChange={(e) => setSettings({...settings, popup: { ...settings.popup, imageUrl: e.target.value }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="https://your-image-url.jpg"
                  />
                </div>
              </div>

              <button onClick={handleSaveSettings} disabled={saving} className="mt-6 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-[#d4a843] transition-colors disabled:opacity-50 shadow-sm">
                <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          )}

          {/* ── TAB 3: SHIPPING ── */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-['Syne'] mb-4">Shipping Logic</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Inside Dhaka Charge (৳)</label>
                  <input 
                    type="number" 
                    value={settings.shipping?.insideDhaka || 0}
                    onChange={(e) => setSettings({...settings, shipping: { ...settings.shipping, insideDhaka: Number(e.target.value) }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Outside Dhaka Charge (৳)</label>
                  <input 
                    type="number" 
                    value={settings.shipping?.outsideDhaka || 0}
                    onChange={(e) => setSettings({...settings, shipping: { ...settings.shipping, outsideDhaka: Number(e.target.value) }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">Free Shipping Threshold (৳)</label>
                <p className="text-xs text-gray-500 mb-3">If a customer's cart total crosses this amount, shipping will be automatically free.</p>
                <input 
                  type="number" 
                  value={settings.shipping?.freeShippingThreshold || 0}
                  onChange={(e) => setSettings({...settings, shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) }})}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <button onClick={handleSaveSettings} disabled={saving} className="mt-6 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-[#d4a843] transition-colors disabled:opacity-50 shadow-sm">
                <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          )}

          {/* ── TAB 4: PAYMENT METHODS ── */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-['Syne'] mb-4">Mobile Banking Setup</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your personal or merchant numbers to receive payments directly.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">bKash Number</label>
                  <input 
                    type="text" 
                    value={settings.payment?.bkashNumber || ""}
                    onChange={(e) => setSettings({...settings, payment: { ...settings.payment, bkashNumber: e.target.value }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#e2136e] transition-colors"
                    placeholder="e.g. 017XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nagad Number</label>
                  <input 
                    type="text" 
                    value={settings.payment?.nagadNumber || ""}
                    onChange={(e) => setSettings({...settings, payment: { ...settings.payment, nagadNumber: e.target.value }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#ed1c24] transition-colors"
                    placeholder="e.g. 016XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rocket Number</label>
                  <input 
                    type="text" 
                    value={settings.payment?.rocketNumber || ""}
                    onChange={(e) => setSettings({...settings, payment: { ...settings.payment, rocketNumber: e.target.value }})}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#8c1515] transition-colors"
                    placeholder="e.g. 019XXXXXXXX"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Instructions (Shown to customer)</label>
                <textarea 
                  rows={3}
                  value={settings.payment?.instructions || ""}
                  onChange={(e) => setSettings({...settings, payment: { ...settings.payment, instructions: e.target.value }})}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="e.g. Please use 'Send Money' option and use your Order ID as reference."
                />
              </div>

              <button onClick={handleSaveSettings} disabled={saving} className="mt-6 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-[#d4a843] transition-colors disabled:opacity-50 shadow-sm">
                <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          )}

          {/* ── TAB 5: COUPONS ── */}
          {activeTab === "coupons" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-['Syne'] mb-4">Create Promo Code</h2>
                <form onSubmit={handleCreateCoupon} className="bg-gray-50 p-6 rounded-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code</label>
                    <input required type="text" value={newCoupon.code} onChange={(e)=>setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="E.g. EID50" className="w-full p-2 border border-gray-300 rounded-sm uppercase focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type</label>
                    <select value={newCoupon.type} onChange={(e)=>setNewCoupon({...newCoupon, type: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm bg-white focus:outline-none focus:border-black">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (৳)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Discount Value</label>
                    <input required type="number" value={newCoupon.value} onChange={(e)=>setNewCoupon({...newCoupon, value: e.target.value})} placeholder="E.g. 15" className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Minimum Spend (৳)</label>
                    <input required type="number" value={newCoupon.minOrderAmt} onChange={(e)=>setNewCoupon({...newCoupon, minOrderAmt: e.target.value})} placeholder="E.g. 1500" className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                    <input required type="date" value={newCoupon.expiryDate} onChange={(e)=>setNewCoupon({...newCoupon, expiryDate: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Usage Limit (Max Uses)</label>
                    <input required type="number" value={newCoupon.maxUses} onChange={(e)=>setNewCoupon({...newCoupon, maxUses: e.target.value})} placeholder="E.g. 100" className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black" />
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <button type="submit" className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-sm font-bold text-sm hover:bg-[#d4a843] transition-colors shadow-sm">
                      <Plus size={16} /> Generate Coupon
                    </button>
                  </div>
                </form>
              </div>

              {/* COUPON LIST */}
              <div>
                <h2 className="text-lg font-bold font-['Syne'] mb-4">Active Coupons</h2>
                <div className="overflow-x-auto border border-gray-200 rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Code</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Discount</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Validity</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Uses</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {coupons.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No coupons created yet.</td>
                        </tr>
                      ) : (
                        coupons.map((coupon, i) => (
                          <tr key={coupon._id || i} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-black text-gray-900 tracking-widest">{coupon.code}</td>
                            <td className="py-3 px-4 text-sm font-bold text-green-600">
                              {coupon.type === 'percentage' ? `${coupon.value}%` : `৳${coupon.value}`}
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-500">
                              {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Invalid Date'}
                            </td>
                            <td className="py-3 px-4 text-xs font-medium text-gray-600">
                              {coupon.usedCount || 0} / {coupon.maxUses}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button 
                                onClick={() => handleDeleteCoupon(coupon._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors inline-flex"
                                title="Delete Coupon"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}