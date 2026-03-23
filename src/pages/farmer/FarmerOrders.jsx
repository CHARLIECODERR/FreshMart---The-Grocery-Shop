import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerOrders, FARMER_ORDERS_INDEX_LINK, updateOrderStatus } from '../../services/orderService';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  ChevronRight, 
  Search,
  Loader2,
  Calendar,
  User,
  MapPin,
  Phone,
  Printer,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const FarmerOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [printingOrder, setPrintingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getFarmerOrders(currentUser.uid);
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching farmer orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50';
      case 'Shipped': return 'bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-50';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-50';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Logistics status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePrint = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      setPrintingOrder(null);
    }, 100);
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-4 lg:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* PRINT STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          .printable-only { display: none !important; }
        }
        @media print {
          @page {
            margin: 2cm;
            size: portrait;
          }
          .no-print { display: none !important; }
          .printable-only { 
            display: block !important; 
            width: 100% !important;
          }
          body { 
            background: #fff !important; 
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact;
          }
          .printable-invoice { 
            width: 100% !important;
            max-width: 650px !important;
            margin: 0 auto !important;
            padding: 2rem !important;
            background: #fff !important;
            border: 1px solid #eee !important;
          }
          .receipt-header {
            text-align: center !important;
            margin-bottom: 2rem !important;
            border-bottom: 2px solid #111 !important;
            padding-bottom: 1.5rem !important;
          }
          .receipt-section-title {
            font-size: 10px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            color: #666 !important;
            margin-bottom: 0.5rem !important;
          }
          .receipt-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 1.5rem 0 !important;
          }
          .receipt-table th {
            text-align: left !important;
            border-bottom: 1px solid #111 !important;
            padding: 8px 4px !important;
            font-size: 11px !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
          }
          .receipt-table td {
            padding: 10px 4px !important;
            border-bottom: 1px solid #eee !important;
            font-size: 13px !important;
          }
          .receipt-total-box {
            margin-top: 2rem !important;
            padding-top: 1rem !important;
            border-top: 2px solid #111 !important;
            text-align: right !important;
          }
        }
      `}} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Logistics Management</h1>
          <p className="text-slate-500 font-medium mt-1">Process and track your harvest fulfillment lifecycle</p>
        </div>
        <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          {['All', 'Placed', 'Shipped', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === tab 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="no-print">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 gap-6">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Logistics...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-[2.5rem] p-16 text-center border border-red-100 shadow-2xl space-y-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-600 shadow-inner">
            <AlertCircle size={40} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Logistics Index Required</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Our automated logistics tracker needs a database index to display your orders. This is a one-time cloud setup.
            </p>
          </div>
          <div className="pt-4">
            <a 
              href={FARMER_ORDERS_INDEX_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all inline-block"
            >
              Configure Cloud Logistics
            </a>
          </div>
          <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.3em]">Estimated activation time: 180 seconds</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-32 text-center border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 border border-slate-100 shadow-inner">
            <ShoppingBag size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Awaiting new orders</h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">When customers purchase your harvest, the logistics logs will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredOrders.map((order) => {
             const formattedDate = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', {
               day: 'numeric',
               month: 'short',
               year: 'numeric'
             }) : 'Recently';

             return (
               <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
                 <div className="flex flex-col lg:flex-row">
                    {/* Left: Metadata */}
                    <div className="flex-1 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-50">
                       <div className="flex items-center gap-4 mb-8">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(order.status)}`}>
                           {order.status}
                         </span>
                         <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                           <Calendar size={14} /> {formattedDate}
                         </div>
                       </div>

                       <div className="flex items-baseline gap-3 mb-8">
                         <h3 className="text-2xl font-black text-slate-900">#LOG-{order.id.slice(-6).toUpperCase()}</h3>
                         <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] italic">Direct Farm Delivery</span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</p>
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                   <User size={20} />
                                </div>
                                <div>
                                   <p className="font-black text-slate-900 text-sm">{order.userName}</p>
                                   <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                      <Phone size={12} className="text-emerald-500" />
                                      {order.shippingAddress?.phone}
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                             <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                                   <MapPin size={20} />
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                   {order.shippingAddress?.street}, {order.shippingAddress?.city}<br/>
                                   <span className="font-black text-slate-900 uppercase">PIN: {order.shippingAddress?.pincode}</span>
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Right: Actions & Financials */}
                    <div className="w-full lg:w-[400px] p-8 sm:p-10 bg-slate-50/30 flex flex-col justify-between">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Proceeds</p>
                          <p className="text-4xl font-black text-slate-900 mb-8 tracking-tighter group-hover:text-emerald-600 transition-colors">₹{order.myTotal}</p>
                          
                          <div className="space-y-3 mb-8">
                             {order.myItems.map((item, idx) => (
                               <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-600 truncate max-w-[150px]">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                                  <span className="font-black text-slate-900">₹{item.price * item.quantity}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="relative group/select">
                             <select 
                               value={order.status}
                               onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                               className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] appearance-none px-6 cursor-pointer hover:bg-slate-800 transition-all border-none focus:ring-2 focus:ring-emerald-500"
                             >
                               <option value="Placed">Update: Placed</option>
                               <option value="Shipped">Update: Shipped</option>
                               <option value="Delivered">Update: Delivered</option>
                               <option value="Cancelled">Update: Cancelled</option>
                             </select>
                             <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" size={18} />
                          </div>
                          <button 
                             onClick={() => handlePrint(order)}
                             className="w-full h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                          >
                             <Printer size={18} /> Print Manifest
                          </button>
                       </div>
                    </div>
                 </div>
               </div>
             );
          })}
        </div>
      )}
      </div>

      {/* HIDDEN INVOICE (RENDERED ONLY FOR PRINTING) */}
      {printingOrder && (
        <div className="printable-only">
          <div className="printable-invoice">
             {/* Header */}
             <div className="receipt-header">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-1">FRESHMART</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Premium Farm-to-Table Logistics</p>
                <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold text-slate-400">
                   <span>www.freshmart.com</span>
                   <span>•</span>
                   <span>Support: +91 98765 43210</span>
                </div>
             </div>

             {/* Transaction Info */}
             <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                   <h4 className="receipt-section-title">Invoice Details</h4>
                   <p className="text-sm font-black text-slate-900 mb-0.5">Order ID: #{printingOrder.id.slice(-10).toUpperCase()}</p>
                   <p className="text-xs font-bold text-slate-500">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                   <p className="text-xs font-bold text-slate-500">Time: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right">
                   <h4 className="receipt-section-title">Bill To</h4>
                   <p className="text-sm font-black text-slate-900 mb-1 uppercase">{printingOrder.userName}</p>
                   <p className="text-xs font-bold text-slate-500 leading-relaxed whitespace-pre-wrap">
                      {printingOrder.shippingAddress?.street}, {printingOrder.shippingAddress?.city}<br/>
                      {printingOrder.shippingAddress?.state} - {printingOrder.shippingAddress?.pincode}
                   </p>
                </div>
             </div>

             {/* Items Table */}
             <table className="receipt-table">
                <thead>
                   <tr>
                      <th style={{ width: '50%' }}>Item Description</th>
                      <th style={{ textAlign: 'center' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                   </tr>
                </thead>
                <tbody>
                   {printingOrder.myItems?.map((item, idx) => (
                      <tr key={idx}>
                         <td className="font-bold text-slate-900">{item.name}</td>
                         <td style={{ textAlign: 'center' }} className="font-bold text-slate-900">{item.quantity}</td>
                         <td style={{ textAlign: 'right' }} className="text-slate-500 font-medium italic">₹{item.price}</td>
                         <td style={{ textAlign: 'right' }} className="font-black text-slate-900">₹{item.price * item.quantity}</td>
                      </tr>
                   ))}
                </tbody>
             </table>

             {/* Financial Summary */}
             <div className="flex justify-end">
                <div className="w-56 space-y-2">
                   <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span>₹{printingOrder.myTotal}.00</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Tax (0%)</span>
                      <span>₹0.00</span>
                   </div>
                   <div className="receipt-total-box flex justify-between items-baseline">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">Grand Total</span>
                      <span className="text-3xl font-black tracking-tighter text-emerald-600">₹{printingOrder.myTotal}</span>
                   </div>
                </div>
             </div>

             {/* Footer */}
             <div className="mt-16 text-center border-t border-slate-100 pt-8">
                <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">Thank you for your business!</h3>
                <p className="text-[10px] text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                   This is a computer-generated invoice. No signature is required. All farm products are verified fresh and locally sourced.
                </p>
                <div className="mt-8 flex items-center justify-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Official Fulfillment Record</p>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
