import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/adminService';
import { 
  TrendingUp, 
  Users, 
  UserPlus, 
  ShoppingBag, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreHorizontal,
  Activity,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Platform Data...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Consumer Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%', isUp: true },
    { label: 'Wholesale Payouts', value: `₹${stats?.totalWholesalePayout || 0}`, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+8.4%', isUp: false },
    { label: 'Active Customers', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5.2%', isUp: true },
    { label: 'Active Suppliers', value: stats?.totalFarmers || 0, icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+2.1%', isUp: true },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      {/* PRINT STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          .printable-only { display: none !important; }
        }
        @media print {
          .no-print { display: none !important; }
          .printable-only { display: block !important; }
          body { background: white !important; }
          .printable-report { 
            width: 100%;
            color: black !important;
            padding: 40px;
          }
        }
      `}} />

      {/* NO PRINT CONTENT */}
      <div className="no-print space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time performance across FreshMart ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex shadow-sm">
            <button className="px-5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white shadow-lg shadow-slate-200 transition-all">Today</button>
            <button className="px-5 py-2 rounded-xl text-xs font-black text-slate-500 hover:text-slate-900 transition-all">Last 7d</button>
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm hover:border-emerald-500 hover:text-emerald-500 transition-all">
            <Calendar size={20} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  <card.icon size={28} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black ${card.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{card.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
            </div>
            {/* Background design */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.03] ${card.color.replace('text', 'bg')}`} />
          </div>
        ))}
      </div>

      {/* Middle Section: Activity & Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Performance Chart Placeholder */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex flex-col relative overflow-hidden group">
           <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                    <Activity size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Revenue Stream</h3>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">Automated volume tracking</p>
                 </div>
              </div>
              <button className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
                 <MoreHorizontal size={24} />
              </button>
           </div>

           <div className="flex-1 min-h-[300px] flex items-end justify-between gap-3 pt-6 relative z-10">
              {[65, 45, 75, 55, 85, 95, 70, 40, 60, 90, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                   <div className="relative w-full h-full min-h-[10px]">
                      <div 
                        className="absolute bottom-0 w-full bg-slate-100 rounded-t-xl group-hover/bar:bg-emerald-500 transition-all duration-500 ease-out" 
                        style={{ height: `${h}%` }}
                      />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity">
                         {h}%
                      </div>
                   </div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">M{i+1}</span>
                </div>
              ))}
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        </div>

        {/* Global Distribution Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Category Split</h3>
              <p className="text-slate-400 text-sm font-medium mb-10">Organic sales are dominating this quarter.</p>
              
              <div className="space-y-6">
                 {[
                   { label: 'Vegetables', value: '42%', color: 'bg-emerald-500' },
                   { label: 'Fruits', value: '28%', color: 'bg-blue-400' },
                   { label: 'Dairy & Eggs', value: '18%', color: 'bg-orange-400' },
                   { label: 'Other', value: '12%', color: 'bg-slate-600' }
                 ].map((cat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-black">
                         <span className="text-slate-300 uppercase tracking-widest">{cat.label}</span>
                         <span>{cat.value}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                         <div className={`${cat.color} h-full rounded-full group-hover:shadow-[0_0_15px_#10b981] transition-all duration-1000`} style={{ width: cat.value }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <button 
             onClick={handlePrint}
             className="relative z-10 w-full bg-white text-slate-900 py-5 rounded-2xl font-black mt-12 text-sm hover:bg-emerald-50 transition-all shadow-xl shadow-slate-950/20 active:scale-95"
           >
              Generate PDF Report
           </button>

           <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-40 -mt-40 blur-[100px]" />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Consumer Sales</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Latest storefront transactions from customers</p>
            </div>
            <Link to="/admin/orders" className="btn-secondary !rounded-2xl flex items-center gap-2 group">
               Full Audit Log <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-emerald-200 group-hover:text-emerald-500 transition-all">
                                #{order.id.slice(-4).toUpperCase()}
                             </div>
                             <div>
                                <p className="font-bold text-slate-900 text-sm">Sale Transaction</p>
                                <p className="text-xs text-slate-400 font-medium">Auto-generated ref</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <p className="font-bold text-slate-900 text-sm">{order.userName || 'Guest User'}</p>
                          <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{order.shippingAddress?.email || 'No email'}</p>
                       </td>
                       <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                            'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                            {order.status}
                          </span>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-slate-400">
                             <Clock size={14} />
                             <span className="text-xs font-bold">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <p className="font-black text-slate-900 text-lg">₹{order.total}</p>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-10 py-20 text-center">
                         <div className="flex flex-col items-center gap-4 opacity-30">
                            <ShoppingBag size={48} />
                            <p className="font-black uppercase tracking-widest text-xs">No transactions recorded yet</p>
                         </div>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
         
         <div className="p-8 bg-slate-50/50 text-center">
            <Link to="/admin/orders" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
               Load Additional Client Records
            </Link>
         </div>
      </div>
      
      {/* Recent Wholesale Activity Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col mt-10">
         <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Wholesale Purchases</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Latest supply inventory acquired from farmers</p>
            </div>
            <Link to="/admin/supply" className="btn-secondary !rounded-2xl flex items-center gap-2 group">
               View Supply Queue <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Supplier</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Supplied</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acquisition Cost</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats?.recentWholesale?.length > 0 ? stats.recentWholesale.map((offer) => (
                    <tr key={offer.id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-emerald-200 group-hover:text-emerald-500 transition-all">
                                #{offer.id.slice(-4).toUpperCase()}
                             </div>
                             <div>
                                <p className="font-bold text-slate-900 text-sm">Wholesale Inv.</p>
                                <p className="text-xs text-slate-400 font-medium">B2B Purchase</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <p className="font-bold text-slate-900 text-sm">{offer.farmerName || 'Direct Farm'}</p>
                       </td>
                       <td className="px-10 py-6">
                          <span className="font-bold text-slate-900 text-sm">{offer.name}</span>
                          <span className="block text-xs text-slate-500">{offer.stock} {offer.unit}</span>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-slate-400">
                             <Clock size={14} />
                             <span className="text-xs font-bold">{offer.approvedAt?.toDate ? offer.approvedAt.toDate().toLocaleDateString() : 'Recently'}</span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <p className="font-black text-slate-900 text-lg">₹{(offer.price || 0) * (offer.stock || 0)}</p>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-10 py-20 text-center">
                         <div className="flex flex-col items-center gap-4 opacity-30">
                            <Package size={48} />
                            <p className="font-black uppercase tracking-widest text-xs">No wholesale purchases yet</p>
                         </div>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
      </div>

      {/* PRINTABLE ONLY CONTENT */}
      <div className="printable-only">
        <div className="printable-report font-sans bg-white">
           <div className="flex justify-between items-start mb-12 border-b-4 border-slate-900 pb-8">
              <div>
                 <h1 className="text-5xl font-black text-slate-900 mb-2 font-black">F<span className="text-emerald-600 italic font-black">M</span>RT</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Platform Performance Report</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                 <p className="text-xl font-black text-slate-900 tracking-tighter">{new Date().toLocaleString()}</p>
              </div>
           </div>

           <div className="grid grid-cols-4 gap-8 mb-12">
              {statCards.map((card, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter">{card.value}</p>
                </div>
              ))}
           </div>

           <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest border-b-2 border-slate-100 pb-2">Recent Platform Activity</h3>
           <table className="w-full text-left border-collapse mb-12">
              <thead>
                 <tr className="border-b-2 border-slate-900">
                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest">Customer</th>
                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest">Status</th>
                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest">Date</th>
                    <th className="py-4 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {stats?.recentOrders?.map((order, idx) => (
                    <tr key={idx}>
                       <td className="py-4">
                          <p className="text-sm font-bold">{order.userName || 'Guest User'}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">REF: #{order.id.slice(-6).toUpperCase()}</p>
                       </td>
                       <td className="py-4 text-[10px] font-black uppercase tracking-widest">{order.status}</td>
                       <td className="py-4 text-sm text-slate-500">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}</td>
                       <td className="py-4 text-right text-lg font-black text-slate-900">₹{order.total}</td>
                    </tr>
                 ))}
              </tbody>
           </table>

           <div className="mt-20 pt-12 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">Authored by FreshMart Administrative Intelligence</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
