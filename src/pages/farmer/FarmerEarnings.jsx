import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerOrders } from '../../services/orderService';
import { 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Wallet,
  Download,
  Filter,
  ArrowRight,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const FarmerEarnings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        const data = await getFarmerOrders(currentUser.uid);
        // Only count delivered orders for actual available balance (simulated)
        setOrders(data);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
        toast.error("Cloud synchronization failed");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchEarningsData();
    }
  }, [currentUser]);

  // Derived stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.myTotal || 0), 0);
  const pendingRevenue = orders
    .filter(order => order.status === 'Placed' || order.status === 'Shipped')
    .reduce((sum, order) => sum + (order.myTotal || 0), 0);
  const clearedRevenue = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + (order.myTotal || 0), 0);
  
  const growthRate = "+12.5%"; // Mocked for design

  const stats = [
    {
      label: "Total Harvest Value",
      value: `₹${totalRevenue.toLocaleString()}`,
      trend: growthRate,
      icon: IndianRupee,
      color: "bg-emerald-500",
      light: "bg-emerald-50"
    },
    {
      label: "Cleared Funds",
      value: `₹${clearedRevenue.toLocaleString()}`,
      sub: "Available for withdrawal",
      icon: Wallet,
      color: "bg-slate-900",
      light: "bg-slate-100"
    },
    {
      label: "Logistics in Transit",
      value: `₹${pendingRevenue.toLocaleString()}`,
      sub: "Awaiting delivery",
      icon: Clock,
      color: "bg-orange-500",
      light: "bg-orange-50"
    }
  ];

  const recentTransactions = orders.slice(0, 5).map(order => ({
    id: order.id,
    type: "Order Credit",
    amount: `+₹${order.myTotal}`,
    status: order.status === 'Delivered' ? 'Completed' : 'Pending',
    date: order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Today'
  }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Calculating Revenue Streams...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 space-y-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* PRINT STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          .printable-only { display: none !important; }
        }
        @media print {
          .no-print { display: none !important; }
          .printable-only { display: block !important; }
          body { background: white !important; }
          .printable-ledger { 
            width: 100%;
            color: black !important;
            padding: 40px;
          }
        }
      `}} />

      {/* NO PRINT CONTENT */}
      <div className="no-print space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-slate-500 font-medium mt-1">Direct farm profits and transaction monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrint}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-slate-900 transition-all flex items-center gap-2"
          >
            <Download size={16} /> Ledger PDF
          </button>
          <button 
            onClick={() => setShowPayoutModal(true)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
          >
            <Wallet size={18} /> Request Payout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.light} rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 opacity-50`} />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 ${stat.light} ${stat.color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center shadow-inner`}>
                  <stat.icon size={28} />
                </div>
                {stat.trend && (
                  <span className="flex items-center gap-1 text-emerald-500 text-xs font-black">
                    <TrendingUp size={14} /> {stat.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                {stat.sub && <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-wide italic">{stat.sub}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Transaction History */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <History className="text-emerald-500" size={24} /> 
              Profit Migration Log
            </h3>
            <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
               {['Overview', 'Logistics', 'Payouts'].map(t => (
                 <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}
                 >
                   {t}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reference</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Change</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${tx.amount.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} rounded-xl flex items-center justify-center shrink-0`}>
                          {tx.amount.startsWith('+') ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        </div>
                        <p className="font-black text-slate-900 text-sm italic">{tx.type}</p>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{tx.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <Calendar size={14} className="text-slate-300" /> {tx.date}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className={`font-black text-lg tracking-tight ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.amount}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                         <div className={`w-1 h-1 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-600' : 'bg-orange-600 animate-pulse'}`}></div>
                         {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-slate-50 bg-slate-50/20">
            <button className="w-full py-4 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:gap-5 transition-all">
              Load Complete Financial History <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
           
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-10 border-b border-white/10 pb-4 w-fit">Revenue Allocation</h4>
                
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Platform Fees (5%)</span>
                      </div>
                      <span className="font-black text-emerald-400 tracking-tighter">₹{(totalRevenue * 0.05).toFixed(0)}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                         <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Delivery Costs</span>
                      </div>
                      <span className="font-black text-blue-400 tracking-tighter">₹0.00</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                         <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Tax Provision</span>
                      </div>
                      <span className="font-black text-orange-400 tracking-tighter">₹0.00</span>
                   </div>
                </div>

                <div className="mt-12 h-3 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                   <div className="h-full bg-emerald-500 w-[70%] transition-all duration-1000" />
                   <div className="h-full bg-blue-500 w-[20%] transition-all duration-1000 delay-200" />
                   <div className="h-full bg-orange-500 w-[10%] transition-all duration-1000 delay-500" />
                </div>
              </div>

              <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Predicted Next Payout</p>
                 <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-black text-white tracking-widest">24 MAR</p>
                    <p className="text-lg font-black text-emerald-400 tracking-tighter">₹{claredRevenue.toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Payout Modal */}
      <AnimatePresence>
        {showPayoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayoutModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-12 max-w-lg w-full relative z-10 shadow-2xl border border-slate-100"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-inner">
                <Wallet size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight">Withdrawal Hub</h3>
              <p className="text-slate-500 text-center font-medium leading-relaxed mb-10">
                Initiate a direct bank transfer of your cleared profits. Estimated arrival: <span className="text-slate-900 font-black italic">2-3 Business Days</span>.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-10 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Clearing</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{claredRevenue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                   <p className="text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-100">UPI: Default</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => {
                    toast.success("Payout request broadcasted");
                    setShowPayoutModal(false);
                  }}
                  disabled={claredRevenue <= 0}
                  className="w-full py-5 bg-slate-900 text-emerald-400 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
                >
                  Confirm Withdrawal
                </button>
                <button 
                  onClick={() => setShowPayoutModal(false)}
                  className="w-full py-5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all"
                >
                  Abort Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>

      {/* PRINTABLE ONLY CONTENT */}
      <div className="printable-only">
        <div className="printable-ledger font-sans bg-white">
           <div className="flex justify-between items-start mb-12 border-b-4 border-slate-900 pb-8">
              <div>
                 <h1 className="text-5xl font-black text-slate-900 mb-2 font-black">H<span className="text-emerald-600 italic font-black">V</span>ST</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Financial Ledger</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                 <p className="text-xl font-black text-slate-900 tracking-tighter">{new Date().toLocaleString()}</p>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Harvest Value</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cleared Funds</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{clearedRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Logistics</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{pendingRevenue.toLocaleString()}</p>
              </div>
           </div>

           <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest border-b-2 border-slate-100 pb-2">Transaction Migration History</h3>
           <table className="w-full text-left border-collapse mb-12">
              <thead>
                 <tr className="border-b-2 border-slate-900">
                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest">Type</th>
                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest">Reference</th>
                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest">Date</th>
                    <th className="py-4 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest">Amount</th>
                    <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest">State</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {orders.map((order, idx) => (
                    <tr key={idx}>
                       <td className="py-4 text-sm font-bold">Order Credit</td>
                       <td className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#LOG-{order.id.slice(-6).toUpperCase()}</td>
                       <td className="py-4 text-sm text-slate-500">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}</td>
                       <td className="py-4 text-right text-lg font-black text-slate-900">₹{order.myTotal}</td>
                       <td className="py-4 text-right text-[10px] font-black uppercase tracking-widest">{order.status}</td>
                    </tr>
                 ))}
              </tbody>
           </table>

           <div className="mt-20 pt-12 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">Authored by FreshMart Financial Network</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerEarnings;
