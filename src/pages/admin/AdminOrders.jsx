import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package,
  ArrowUpRight,
  MoreVertical,
  Loader2,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                         o.userName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Audit</h1>
          <p className="text-slate-500 font-medium mt-1">Global transaction tracking and fulfillment pipeline</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           {['All', 'Pending', 'Shipped', 'Delivered'].map(s => (
             <button
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <div className="relative group max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by ID or Customer..." 
                 className="w-full bg-white border-none rounded-xl py-3 pl-11 pr-4 shadow-sm focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         {loading ? (
            <div className="p-32 flex justify-center">
               <Loader2 className="animate-spin text-emerald-500" size={48} />
            </div>
         ) : filteredOrders.length === 0 ? (
            <div className="p-32 text-center">
               <ShoppingBag size={48} className="text-slate-200 mx-auto mb-4" />
               <h3 className="text-xl font-black text-slate-900">No Orders Found</h3>
            </div>
         ) : (
            <div className="flex flex-col divide-y divide-slate-50">
               {/* Table Header - Desktop Only */}
               <div className="hidden lg:flex items-center px-10 py-6 bg-slate-50/50">
                  <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Logistics</div>
                  <div className="w-56 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Context</div>
                  <div className="w-48 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flow State</div>
                  <div className="w-40 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</div>
                  <div className="w-32 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Volume</div>
               </div>

               {/* Order Rows */}
               {filteredOrders.map((order) => (
                  <div key={order.id} className="group hover:bg-slate-50/50 transition-all px-6 lg:px-10 py-6 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0">
                     {/* Logistics */}
                     <div className="flex-1 flex items-center gap-4">
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-emerald-200 group-hover:text-emerald-500 transition-all shadow-sm">
                           <span className="text-[8px] opacity-50 mb-0.5">ID</span>
                           {order.id.slice(-4).toUpperCase()}
                        </div>
                        <div>
                           <p className="font-black text-slate-900 text-sm">Standard Fulfillment</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-0.5">{order.paymentMethod || 'Online Payment'}</p>
                        </div>
                     </div>

                     {/* Info Grid for Mobile */}
                     <div className="grid grid-cols-2 lg:contents gap-6 pt-6 lg:pt-0 border-t lg:border-none border-slate-50">
                        {/* Customer */}
                        <div className="lg:w-56 flex flex-col">
                           <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</span>
                           <p className="font-bold text-slate-900 text-sm truncate">{order.userName}</p>
                           <p className="text-[10px] text-slate-400 font-bold truncate">
                              {order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}
                           </p>
                        </div>

                        {/* Flow State */}
                        <div className="lg:w-48 flex flex-col">
                           <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                           <select 
                             value={order.status}
                             onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                             className={`w-fit lg:w-36 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                               order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-2 ring-emerald-500/5' : 
                               order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100 ring-2 ring-blue-500/5' : 
                               order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                               'bg-orange-50 text-orange-600 border-orange-100 ring-2 ring-orange-500/5'
                             }`}
                           >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                           </select>
                        </div>

                        {/* Date */}
                        <div className="lg:w-40 flex flex-col">
                           <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</span>
                           <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                              <Calendar size={14} className="text-slate-300" />
                              {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Today'}
                           </div>
                        </div>

                        {/* Volume */}
                        <div className="lg:w-32 lg:text-right flex flex-col">
                           <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</span>
                           <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">₹{order.total}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminOrders;
