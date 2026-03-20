import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerProducts } from '../../services/productService';
import { getFarmerOrders } from '../../services/orderService';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight,
  Loader2,
  Plus,
  X,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const FarmerDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    earnings: 0,
    customers: 0,
    delivered: 0,
    growth: '+0%',
    yieldData: []
  });
  const [fullOrders, setFullOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInsightLog, setShowInsightLog] = useState(false);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (currentUser) {
          const productData = await getFarmerProducts(currentUser.uid);
          const orderData = await getFarmerOrders(currentUser.uid);
          setFullOrders(orderData);
          
          const totalEarnings = orderData.reduce((sum, order) => sum + (order.myTotal || 0), 0);
          const uniqueCustomers = new Set(orderData.map(order => order.userId)).size;
          const deliveredCount = orderData.filter(order => order.status === 'Delivered').length;

          setStats({
            products: productData.length,
            orders: orderData.length,
            earnings: totalEarnings,
            customers: uniqueCustomers,
            delivered: deliveredCount,
            growth: orderData.length > 0 ? '+15.4%' : '+0%',
            yieldData: [
              { name: 'Mon', value: 400 },
              { name: 'Tue', value: 300 },
              { name: 'Wed', value: 600 },
              { name: 'Thu', value: 800 },
              { name: 'Fri', value: 500 },
              { name: 'Sat', value: 900 },
              { name: 'Sun', value: 700 }
            ]
          });

          setRecentOrders(orderData.slice(0, 5));
          
          const newInsights = [];
          if (orderData.length > 0) {
            newInsights.push({ type: 'order', msg: `New high-value order #LOG-${orderData[0].id.slice(-4).toUpperCase()} received.` });
          }
          if (productData.length < 5) {
            newInsights.push({ type: 'alert', msg: "Inventory diversity is low. Consider listing seasonal harvests." });
          }
          if (deliveredCount === orderData.length && orderData.length > 0) {
            newInsights.push({ type: 'order', msg: "Fulfillment excellence! All orders are marked delivered." });
          } else if (orderData.length > deliveredCount) {
             newInsights.push({ type: 'alert', msg: `${orderData.length - deliveredCount} logistics operations are currently in progress.` });
          }
          setInsights(newInsights);
        }
      } catch (error) {
        console.error("Dashboard sync error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const handleExport = () => {
    try {
      if (fullOrders.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Define CSV headers
      const headers = ["Order ID", "Customer", "Date", "Status", "Total Amount (₹)", "Items"];
      
      // Map data to rows
      const rows = fullOrders.map(order => [
        order.id,
        order.userName || "N/A",
        order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "N/A",
        order.status,
        order.myTotal || 0,
        order.myItems?.map(item => `${item.name} (x${item.quantity})`).join("; ") || ""
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `harvest_analytics_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Harvest Analytics Exported as CSV");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export analytics");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={56} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Synchronizing Farm Intelligence...</p>
      </div>
    );
  }

  if (userData?.status === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-orange-500 mb-8 shadow-inner border border-orange-100">
          <Clock className="animate-pulse" size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Application Under Review</h2>
        <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed text-lg">
          Our team is verifying your farm credentials. You'll receive full marketplace access once approved.
        </p>
        <div className="mt-10 flex gap-6">
          <Link to="/" className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">Return Home</Link>
          <Link to="/farmer/profile" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">View Profile</Link>
        </div>
      </div>
    );
  }

  const orderEfficiency = stats.orders > 0 ? (stats.delivered / stats.orders) * 100 : 0;
  const revenueIndex = stats.earnings > 5000 ? 95 : (stats.earnings / 5000) * 95;
  const performanceIndex = ((orderEfficiency + (stats.products * 10) + (revenueIndex)) / 3).toFixed(1);

  const statCards = [
    { label: 'Harvest Catalog', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', isUp: true },
    { label: 'Logistics Logs', value: stats.orders, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: stats.growth, isUp: true },
    { label: 'Net Proceeds', value: `₹${stats.earnings.toLocaleString()}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+18.2%', isUp: true },
    { label: 'Direct Reach', value: stats.customers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5.1%', isUp: true },
  ];

  return (
    <div className="p-4 lg:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto relative">
      <AnimatePresence>
        {showInsightLog && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowInsightLog(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
            >
              <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                className="bg-white w-full max-w-md h-full shadow-2xl p-10 flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black text-slate-900">Insight Logs</h3>
                   <button onClick={() => setShowInsightLog(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={24} /></button>
                </div>
                
                <div className="space-y-6 overflow-y-auto pr-4">
                  {insights.length > 0 ? insights.map((log, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        log.type === 'order' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {log.type === 'order' ? <ShoppingBag size={20} /> : <AlertCircle size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{log.msg}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Status: Active</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                       No critical alerts detected
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time harvest analytics and logistics control</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
             onClick={handleExport}
             className="px-6 py-4 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
          >
            Export Analytics
          </button>
          <button 
           onClick={() => setShowInsightLog(true)}
           className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            Tactical Insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700 opacity-40`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                  <stat.icon size={28} />
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-black ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.trend} <ArrowUpRight size={14} />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors uppercase">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 flex flex-col justify-between group overflow-hidden relative">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Yield Monitoring</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Logistics Volume / Week</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
               <span className="text-[9px] font-black text-slate-400 uppercase px-3 cursor-pointer hover:text-slate-900 transition-colors">Daily</span>
               <span className="text-[9px] font-black text-white uppercase px-3 py-1.5 bg-slate-900 rounded-lg shadow-lg">Weekly</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 mt-12 relative z-10 px-4">
             {stats.yieldData.map((d, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <div className="w-full relative h-[100%] flex flex-col justify-end">
                     <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.value / 1000) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                        className="bg-emerald-500/10 group-hover/bar:bg-emerald-500 w-full rounded-2xl border-t border-emerald-500/20 transition-all duration-500 relative"
                     >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                           ₹{d.value}
                        </div>
                     </motion.div>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover/bar:text-slate-900 transition-colors">{d.name}</span>
               </div>
             ))}
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full -mr-32 -mb-32 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 -rotate-12 translate-y-1/2 scale-150" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-1">Performance Index</p>
              <h3 className="text-xl font-black text-white italic">Farmer Grade Profile</h3>
              
              <div className="mt-16 flex flex-col items-center justify-center relative">
                 <div className="w-48 h-48 rounded-full border-[12px] border-white/5 flex items-center justify-center relative">
                    <svg className="w-full h-full -rotate-90 absolute top-0 left-0">
                       <circle cx="50%" cy="50%" r="44%" className="stroke-emerald-500 fill-none" strokeWidth="12" strokeDasharray="270" strokeDashoffset={270 - (performanceIndex * 2.7)} strokeLinecap="round" />
                    </svg>
                    <div className="text-center">
                       <p className="text-5xl font-black text-white tracking-tighter">{performanceIndex}</p>
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Tactical Score</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-white/10 transition-colors">
               <p className="text-xs font-medium text-white/50 leading-relaxed italic mb-8">
                 Your performance is <span className="text-emerald-400 font-bold uppercase tracking-widest">Outstanding</span> across all logistics channels.
               </p>
               <Link to="/farmer/products" className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:text-white transition-colors">
                  Optimization Plan <ArrowRight size={16} />
               </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <ShoppingBag className="text-emerald-500" size={24} /> 
             Critical Logistics Logs
          </h3>
          <Link to="/farmer/orders" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center gap-2">
             Access Fulfilment Center <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reference</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield Total</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Channel Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/20 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-black italic">
                           {order.userName?.charAt(0) || 'U'}
                        </div>
                        <p className="font-black text-slate-900 text-sm">{order.userName}</p>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="font-black text-lg tracking-tight text-slate-900 italic">₹{order.myTotal}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-50'
                      }`}>
                         {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Awaiting first harvest cycle fulfillment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
