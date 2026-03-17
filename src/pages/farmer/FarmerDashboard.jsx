import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerProducts } from '../../services/productService';
import { getFarmerOrders } from '../../services/orderService';
import { 
  Plus, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight,
  Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    earnings: 0,
    customers: 12
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (userData?.status === 'pending') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const prods = await getFarmerProducts(currentUser.uid);
        const farmerOrders = await getFarmerOrders(currentUser.uid);
        const totalEarnings = farmerOrders.reduce((acc, curr) => acc + (curr.myTotal || 0), 0);

        setStats({
          products: prods.length,
          orders: farmerOrders.length,
          earnings: totalEarnings,
          customers: 5
        });
        setRecentOrders(farmerOrders.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchStats();
    }
  }, [currentUser, userData]);

  if (loading) {
    return (
      <div className="flex justify-center p-32">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  if (userData?.status === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-8 shadow-inner">
          <Clock className="animate-pulse" size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Application Under Review</h2>
        <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
          Thanks for joining FreshMart! Our administrators are currently verifying your farm credentials. 
          You'll get full access to sell products and manage orders once approved.
        </p>
        <div className="mt-10 flex gap-4">
          <Link to="/" className="btn-secondary px-8">Return Home</Link>
          <Link to="/account" className="btn-primary px-8">View My Account</Link>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Orders', value: stats.orders, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Earnings', value: `₹${stats.earnings}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Happy Customers', value: stats.customers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto pb-10">
      {/* Premium Welcome Header */}
      <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-sm group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-xs font-black uppercase tracking-widest mb-6">
              <TrendingUp size={14} />
              <span>Yield Monitoring Active</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Welcome back, <br className="hidden lg:block" />
              <span className="text-emerald-600">{currentUser?.displayName?.split(' ')[0] || 'Farmer'}!</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-lg text-lg leading-relaxed mb-10">
              Your farm's digital ecosystem is performing optimally today. You have <span className="text-slate-900 font-black">{stats.orders} active deliveries</span> in the pipeline.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/farmer/products/new" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center gap-3">
                <Plus size={20} /> New Product
              </Link>
              <Link to="/farmer/orders" className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
                Manage Orders
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center gap-4 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100/50 backdrop-blur-sm self-stretch justify-center">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Performance Index</p>
                <div className="text-6xl font-black text-slate-900 mb-2">92<span className="text-emerald-500">%</span></div>
                <div className="flex items-center gap-2 text-emerald-600 font-black text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                   <TrendingUp size={14} /> +4.2% Growth
                </div>
             </div>
          </div>
        </div>

        {/* Subtle Decorative Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-60" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50 rounded-full blur-[80px] -ml-24 -mb-24 opacity-40" />
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="relative z-10">
              <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-6 duration-500`}>
                <stat.icon size={30} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] ${stat.color.replace('text', 'bg')}`} />
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full group">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Harvest Orders</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time fulfillment tracking</p>
              </div>
              <Link to="/farmer/orders" className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                <ArrowUpRight size={20} />
              </Link>
            </div>
            
            <div className="divide-y divide-slate-50 flex-grow">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:border-emerald-200 transition-all font-black text-xs shadow-sm">
                      #{order.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-base">{order.userName || 'Customer'}</p>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Clock size={12} /> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-emerald-600 uppercase tracking-tighter">Verified Order</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 mb-1">₹{order.myTotal || order.total}</p>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100">
                     <ShoppingBag size={40} />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Awaiting new orders...</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50/30 text-center">
              <Link to="/farmer/orders" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
                 See All Logistics & Records
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="flex flex-col h-full gap-8">
            {/* Insights Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex-1 shadow-2xl">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/10">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Farm Intelligence</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                  Market demand for <span className="text-emerald-400 font-black italic">Organic Herbs</span> is up by 30%. Consider listing more to maximize revenue.
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Inventory Level</span>
                      <span className="text-emerald-400">92% Optimal</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
            </div>

            {/* Quick Action Card - Replaced Floating feel with static premium card */}
            <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
               <div className="relative z-10">
                  <h4 className="text-xl font-black mb-2">Export Data</h4>
                  <p className="text-emerald-100 text-xs font-medium mb-8 leading-relaxed">Download your complete sales and performance report for this month.</p>
                  <button className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg active:scale-95">
                    Download PDF
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
