"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Download, ArrowUpDown, X, Star, ExternalLink, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [mailTarget, setMailTarget] = useState<any>(null);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (error) {
      toast.error("Failed to load customers data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const processedCustomers = customers
    .filter((c: any) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c._id && c._id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a: any, b: any) => {
      if (sortBy === "most_orders") return b.totalOrders - a.totalOrders;
      if (sortBy === "highest_spent") return b.totalSpent - a.totalSpent;
      if (sortBy === "highest_paid") return b.totalPaid - a.totalPaid; // নতুন সর্ট অপশন
      if (sortBy === "newest") return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
      if (sortBy === "oldest") return new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime();
      return 0;
    });

  // 🔥 CSV এক্সপোর্ট ফাংশন
  const handleExportCSV = () => {
    if (processedCustomers.length === 0) {
      toast.error("No customers found to export!");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Total Orders", "Total Ordered Value", "Actual Paid (Revenue)"];
    const csvRows = processedCustomers.map((c: any) => [
      `"${c.name}"`,
      `"${c.email || 'N/A'}"`,
      `"${c.phone || 'N/A'}"`,
      c.totalOrders,
      c.totalSpent,
      c.totalPaid
    ].join(','));

    const csvData = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Customer_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("CSV file downloaded successfully!");
  };

  const handleOpenMailModal = (customer: any = null) => {
    setMailTarget(customer);
    setMailSubject("");
    setMailBody("");
    setIsMailModalOpen(true);
  };

 const handleSendMail = async (e: any) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: mailTarget ? mailTarget.email : "all",
          subject: mailSubject,
          message: mailBody,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Email sent successfully to ${mailTarget ? mailTarget.name : "all customers"}!`);
        setIsMailModalOpen(false);
      } else {
        toast.error(data.message || "Failed to send email");
      }
    } catch (error) {
      toast.error("Something went wrong while sending email.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium font-['Syne']">Loading Real Data...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Syne'] tracking-tight">
            Customer Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage, analyze, and engage with your customers</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => handleOpenMailModal()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-sm text-xs font-bold hover:bg-black transition-all shadow-sm"
          >
            <Mail size={16} /> Broadcast Email
          </button>
          {/* 🔥 CSV বাটনে onClick অ্যাড করা হলো */}
          <button 
            onClick={handleExportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96 flex items-center">
          <Search className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
          <input 
            type="text" 
            placeholder="Search by Name, Email, Phone or UID..." 
            className="w-full py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:border-[#d4a843] focus:ring-1 focus:ring-[#d4a843] text-sm bg-gray-50 focus:bg-white transition-all"
            style={{ paddingLeft: "40px", paddingRight: "36px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 text-gray-400 hover:text-red-500">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <ArrowUpDown size={14}/> Sort By:
          </span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-sm text-sm px-3 py-2 bg-gray-50 focus:outline-none focus:border-[#d4a843]"
          >
            <option value="newest">Recent Activity</option>
            <option value="oldest">Oldest Customers</option>
            <option value="most_orders">Most Orders</option>
            <option value="highest_paid">Highest Paid (Revenue)</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                <th className="px-6 py-5">Customer Info</th>
                <th className="px-6 py-5">Contact Details</th>
                <th className="px-6 py-5">Value & Revenue</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                processedCustomers.map((customer: any) => (
                  <tr key={customer._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                    
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-600 font-['Syne']">
                          {customer.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-2">
                            {customer.name}
                            {/* VIP ব্যাজ এখন শুধু পেইড অ্যামাউন্টের ওপর নির্ভর করবে */}
                            {customer.totalPaid >= 10000 && (
                              <span className="flex items-center gap-0.5 text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200 uppercase tracking-widest">
                                <Star size={10} className="fill-yellow-500" /> VIP
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">UID: {customer._id.toString().toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">{customer.email || "No email"}</p>
                      <p className="text-xs text-gray-500 mt-1">{customer.phone}</p>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="flex gap-6 items-center">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Orders</p>
                          <p className="font-black text-gray-900 text-lg leading-none mt-1">{customer.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ordered Val.</p>
                          <p className="font-bold text-gray-500 text-sm leading-none mt-1">৳{customer.totalSpent}</p>
                        </div>
                        <div className="bg-green-50 px-3 py-2 rounded-sm border border-green-100">
                          <p className="text-[9px] text-green-700 uppercase font-black tracking-widest flex items-center gap-1"><CheckCircle size={10}/> Actual Paid</p>
                          <p className="font-black text-green-700 text-xl leading-none mt-1">৳{customer.totalPaid}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenMailModal(customer)}
                          className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-sm transition-colors"
                          title="Send Direct Email"
                        >
                          <Mail size={16} />
                        </button>
                        <Link 
                          href={`/admin/orders?search=${customer._id.toString()}`} 
                          className="p-2 text-gray-500 hover:text-[#d4a843] bg-gray-50 hover:bg-[#d4a843]/10 border border-gray-200 hover:border-[#d4a843] rounded-sm transition-colors flex items-center gap-1"
                          title="View All Orders"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isMailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* Modal content */}
          <div className="bg-white w-full max-w-lg rounded-sm shadow-xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Send size={18} className="text-[#d4a843]" /> 
                {mailTarget ? `Message to ${mailTarget.name}` : "Broadcast Message to All"}
              </h2>
              <button onClick={() => setIsMailModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendMail} className="p-6 space-y-4">
              {mailTarget && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">To</label>
                  <input type="text" disabled value={`${mailTarget.name} (${mailTarget.email})`} className="w-full py-2 px-3 border border-gray-200 rounded-sm bg-gray-50 text-sm text-gray-600 cursor-not-allowed" />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Subject</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Order Update / Special Offer" 
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#d4a843] text-sm"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Message</label>
                <textarea 
                  required 
                  rows={6}
                  placeholder="Write your email content here..." 
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#d4a843] text-sm resize-none"
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                ></textarea>
              </div>
              <div className="pt-2">
    <button 
      type="submit" 
      disabled={isSending}
      className="w-full py-3 bg-[#d4a843] text-white rounded-sm text-sm font-bold hover:bg-[#b88e33] transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
    >
      {isSending ? (
        <><span className="animate-spin text-white">⚙</span> Sending...</>
      ) : (
        "Send Email"
      )}
    </button>
  </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}