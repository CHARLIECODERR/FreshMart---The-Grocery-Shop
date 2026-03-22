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
  ExternalLink,
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
      <style dangerouslySetInnerHTML={{
        __html: `
  @media screen {
    .printable-only { display: none !important; }
  }

  @media print {
    body * {
      visibility: hidden;
    }

    .printable-only, .printable-only * {
      visibility: visible;
    }

    .printable-only {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      padding: 0;
      background: white;
    }

    .printable-invoice {
      width: 800px !important;
      min-height: auto !important;
      padding: 50px !important;
      background: white;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    @page {
      size: portrait;
      margin: 0;
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
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab
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
                              {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                              <span className="font-black text-slate-900 uppercase">PIN: {order.shippingAddress?.pincode}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Financials */}
                    <div className="w-full lg:w-[400px] p-8 sm:p-10 bg-slate-50/30 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Proceeds</p>
                           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">GST Included (5%)</p>
                        </div>
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
                          className="w-full h-14 bg-white border border-slate-200 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                        >
                          <ExternalLink size={18} /> Generate Invoice
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

      {/* PRINTABLE CONTENT */}
      {printingOrder && (
        <div className="printable-only">
          <div className="printable-invoice font-sans bg-white border border-slate-200">
            <div className="flex justify-between items-start mb-16">
              <div>
                <h1 className="text-4xl font-black text-emerald-600 mb-4 tracking-tighter" style={{ fontFamily: "'Montserrat', sans-serif" }}>FreshMart</h1>
                <div className="text-sm text-slate-500 font-medium">
                  <p className="font-black text-slate-900">Premium Farmer Collective</p>
                  <p>Logistics Hub #009-X</p>
                  <p>Maharashtra, INDIA</p>
                  <p>hello@freshmart.delivery</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-[#84bd00] text-white px-10 py-4 rounded-lg mb-4 inline-block">
                  <h2 className="text-xl font-bold">Receipt for #{printingOrder.id.slice(-6).toUpperCase()}</h2>
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">
                  Transaction Date: {printingOrder.createdAt?.toDate ? printingOrder.createdAt.toDate().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : 'Recently'}
                </p>
              </div>
            </div>

            <div className="mb-16">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Recipient:</h4>
              <p className="text-2xl font-black text-slate-900">{printingOrder.userName}</p>
              <div className="text-base text-slate-600 font-medium mt-1">
                <p>{printingOrder.shippingAddress?.street}</p>
                <p>{printingOrder.shippingAddress?.city}, {printingOrder.shippingAddress?.pincode}</p>
                <p className="font-black text-slate-900 mt-2">{printingOrder.shippingAddress?.phone}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-16">
              <thead>
                <tr className="bg-[#84bd00] text-white">
                  <th className="p-4 text-xs font-black uppercase tracking-widest rounded-tl-lg">Product / Service</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest">Description</th>
                  <th className="p-4 text-center text-xs font-black uppercase tracking-widest">Qty.</th>
                  <th className="p-4 text-right text-xs font-black uppercase tracking-widest">Cost</th>
                  <th className="p-4 text-right text-xs font-black uppercase tracking-widest rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border-x border-b border-slate-100">
                {printingOrder.myItems?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-6 font-black text-slate-900 text-base">{item.name}</td>
                    <td className="p-6 text-sm text-slate-500 italic max-w-xs">{item.description || 'Verified Fresh Market Harvest - Direct from farmer.'}</td>
                    <td className="p-6 text-center text-base font-bold text-slate-900">{item.quantity}</td>
                    <td className="p-6 text-right text-base text-slate-600 font-medium">₹{item.price}</td>
                    <td className="p-6 text-right text-lg font-black text-slate-900">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold text-slate-400 italic mb-10">Thanks for your business!</p>
                <div className="flex items-center gap-2 opacity-30 grayscale mt-32">
                  <div className="h-6 w-6 bg-emerald-600 rounded-full"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">POWERED BY FRESHMART</p>
                </div>
              </div>
              <div className="w-[300px]">
                 <h3 className="text-lg font-black text-slate-900 mb-6 border-b border-slate-100 pb-2">Receipt for Payment</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between text-base font-medium text-slate-500">
                     <span>Subtotal</span>
                     <span>₹{(printingOrder.myTotal - (printingOrder.myTotal * 5 / 105)).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-base font-medium text-slate-500">
                     <span>Tax (GST 5%)</span>
                     <span>₹{(printingOrder.myTotal * 5 / 105).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 border-t-2 border-slate-900">
                     <span>Total</span>
                     <span>₹{printingOrder.myTotal}</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
