import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerSupplyOffers } from '../../services/supplyService';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Calendar,
  Printer,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FarmerOrders = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printingOrder, setPrintingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getFarmerSupplyOffers(currentUser.uid);
        // We only consider 'accepted' offers as confirmed orders/purchases
        const acceptedOffers = data.filter(offer => offer.status === 'accepted');
        setOrders(acceptedOffers);
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

  const handlePrint = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      setPrintingOrder(null);
    }, 100);
  };

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Wholesale Purchases</h1>
          <p className="text-slate-500 font-medium mt-1">Your supply offers that have been purchased by the Admin Hub.</p>
        </div>
      </div>

      <div className="no-print">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 gap-6">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('farmer.loading')}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-[2.5rem] p-16 text-center border border-red-100 shadow-2xl space-y-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-600 shadow-inner">
            <AlertCircle size={40} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Error Loading Purchases</h3>
            <p className="text-slate-600 font-medium leading-relaxed">{error}</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-32 text-center border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 border border-slate-100 shadow-inner">
            <ShoppingBag size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No Purchased Offers Yet</h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">When the Admin approves your supply offer, it will appear here as a confirmed wholesale purchase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map((order) => {
             const formattedDate = order.approvedAt?.toDate ? order.approvedAt.toDate().toLocaleDateString('en-IN', {
               day: 'numeric',
               month: 'short',
               year: 'numeric'
             }) : order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', {
               day: 'numeric',
               month: 'short',
               year: 'numeric'
             }) : 'Recently';

             const totalValue = (order.price || 0) * (order.stock || 0);

             return (
               <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
                 <div className="flex flex-col lg:flex-row">
                    {/* Left: Metadata */}
                    <div className="flex-1 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-50">
                       <div className="flex items-center gap-4 mb-8">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50`}>
                           Purchased
                         </span>
                         <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                           <Calendar size={14} /> Approved: {formattedDate}
                         </div>
                       </div>

                       <div className="flex items-baseline gap-3 mb-8">
                         <h3 className="text-2xl font-black text-slate-900">#WS-{order.id.slice(-6).toUpperCase()}</h3>
                         <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] italic">Wholesale Purchase</span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</p>
                             <p className="font-black text-slate-900 text-sm">#WS-{order.id.slice(-6).toUpperCase()}</p>
                          </div>
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Supplied</p>
                             <p className="text-sm font-bold text-slate-600 truncate">{order.name}</p>
                          </div>
                          <div className="col-span-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2">
                             <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
                             <p className="text-[11px] text-blue-700 font-medium">This item has been purchased by the Admin to be sorted into the retail storefront.</p>
                          </div>
                       </div>
                    </div>

                    {/* Right: Actions & Financials */}
                    <div className="w-full lg:w-[400px] p-8 sm:p-10 bg-slate-50/30 flex flex-col justify-between">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payout Value</p>
                          <p className="text-4xl font-black text-slate-900 mb-8 tracking-tighter group-hover:text-emerald-600 transition-colors">₹{totalValue}</p>
                          
                          <div className="space-y-3 mb-8">
                               <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-600">{order.name} <span className="text-slate-400">({order.stock} {order.unit}) @ ₹{order.price}/{order.unit}</span></span>
                                  <span className="font-black text-slate-900">₹{totalValue}</span>
                               </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <button 
                             onClick={() => handlePrint(order)}
                             className="w-full h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                          >
                             <Printer size={18} /> Print Wholesale Receipt
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
             <div className="receipt-header">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-1">FRESHMART</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Wholesale Acquisition Receipt</p>
                <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold text-slate-400">
                   <span>www.freshmart.com</span>
                   <span>•</span>
                   <span>Admin Hub: +91 98765 43210</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                   <h4 className="receipt-section-title">Wholesale ID</h4>
                   <p className="text-sm font-black text-slate-900 mb-0.5">#WS-{printingOrder.id.slice(-10).toUpperCase()}</p>
                   <p className="text-xs font-bold text-slate-500">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                   <h4 className="receipt-section-title">PURCHASER</h4>
                   <p className="text-sm font-black text-slate-900 mb-1 uppercase">FreshMart Central</p>
                   <p className="text-xs font-bold text-slate-500 leading-relaxed whitespace-pre-wrap">
                      Central Wholesale Warehouse<br/>
                      Internal Processing Drop-off
                   </p>
                </div>
             </div>

             <table className="receipt-table">
                <thead>
                   <tr>
                      <th style={{ width: '50%' }}>Items Supplied</th>
                      <th style={{ textAlign: 'center' }}>Quantity</th>
                      <th style={{ textAlign: 'right' }}>Rate</th>
                      <th style={{ textAlign: 'right' }}>Total Value</th>
                   </tr>
                </thead>
                <tbody>
                      <tr>
                         <td className="font-bold text-slate-900">{printingOrder.name}</td>
                         <td style={{ textAlign: 'center' }} className="font-bold text-slate-900">{printingOrder.stock} {printingOrder.unit}</td>
                         <td style={{ textAlign: 'right' }} className="text-slate-500 font-medium italic">₹{printingOrder.price}/{printingOrder.unit}</td>
                         <td style={{ textAlign: 'right' }} className="font-black text-slate-900">₹{(printingOrder.price || 0) * (printingOrder.stock || 0)}</td>
                      </tr>
                </tbody>
             </table>

             <div className="flex justify-end">
                <div className="w-56 space-y-2">
                   <div className="receipt-total-box flex justify-between items-baseline">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">Total Payout</span>
                      <span className="text-3xl font-black tracking-tighter text-emerald-600">₹{(printingOrder.price || 0) * (printingOrder.stock || 0)}</span>
                   </div>
                </div>
             </div>

             <div className="mt-16 text-center border-t border-slate-100 pt-8">
                <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">Wholesale Payment Guaranteed</h3>
                <p className="text-[10px] text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                   This confirms FreshMart's acquisition of your supplied goods.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
