import React, { useState, useEffect } from 'react';
import { getAllSupplyOffers, approveSupplyOffer, rejectSupplyOffer } from '../../services/adminService';
import { deleteSupplyOffer } from '../../services/supplyService';
import {
  Search, Package, Trash2, Loader2, RefreshCw, ShoppingBag,
  CheckCircle2, XCircle, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Rejected'];

const AdminSupplyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await getAllSupplyOffers();
      setOffers(data || []);
    } catch (error) {
      toast.error('Failed to load supply offers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offer) => {
    if (!window.confirm(`Delete "${offer.name}" offer? This cannot be undone.`)) return;
    try {
      setDeletingId(offer.id);
      await deleteSupplyOffer(offer.id);
      setOffers(prev => prev.filter(p => p.id !== offer.id));
      toast.success('Supply offer deleted permanently.');
    } catch {
      toast.error('Failed to delete offer');
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (offer) => {
    try {
      setApprovingId(offer.id);
      await approveSupplyOffer(offer.id);
      setOffers(prev => prev.map(p => p.id === offer.id ? { ...p, status: 'accepted' } : p));
      toast.success(`Purchased "${offer.name}" for wholesale inventory!`);
    } catch {
      toast.error('Failed to approve offer');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (offer) => {
    try {
      setRejectingId(offer.id);
      await rejectSupplyOffer(offer.id);
      setOffers(prev => prev.map(p => p.id === offer.id ? { ...p, status: 'rejected' } : p));
      toast.success(`"${offer.name}" offer rejected.`);
    } catch {
      toast.error('Failed to reject offer');
    } finally {
      setRejectingId(null);
    }
  };

  const pendingCount = offers.filter(p => p.status === 'pending').length;
  const categories = ['All', ...new Set(offers.map(p => p.category).filter(Boolean))];

  const filtered = offers.filter(p => {
    const matchSearch = (p.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      p.farmerName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStatus =
      statusFilter === 'All' ? true :
      statusFilter === 'Pending' ? p.status === 'pending' :
      statusFilter === 'Accepted' ? p.status === 'accepted' :
      statusFilter === 'Rejected' ? p.status === 'rejected' : true;
    return matchSearch && matchCat && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100"><CheckCircle2 size={10} /> Purchased</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-100"><XCircle size={10} /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100"><Clock size={10} className="animate-pulse" /> Pending</span>;
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Wholesale Supply Offers</h1>
          <p className="text-slate-500 font-medium mt-1">{offers.length} total offers from farmers</p>
        </div>
        <button onClick={fetchOffers} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-500 shrink-0" />
            <p className="text-sm font-bold text-amber-900">
              <span className="font-black">{pendingCount} farmer offer{pendingCount > 1 ? 's' : ''}</span> awaiting review internally
            </p>
          </div>
          <button onClick={() => setStatusFilter('Pending')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shrink-0">
            Review Now
          </button>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit gap-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab}
              {tab === 'Pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[8px] rounded-full px-1.5 py-0.5">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search offer name or farmer..."
              className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 gap-4 text-slate-400">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Offers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-32 text-center">
            <ShoppingBag size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-900">No Offers Found</h3>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            <div className="hidden lg:flex items-center px-8 py-5 bg-slate-50/50">
              <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Offer Details</div>
              <div className="w-32 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</div>
              <div className="w-32 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Farmer</div>
              <div className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Expected Price</div>
              <div className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quantity Offered</div>
              <div className="w-28 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</div>
              <div className="w-40 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</div>
            </div>

            {filtered.map(offer => (
              <div key={offer.id} className={`flex flex-col lg:flex-row lg:items-center px-6 lg:px-8 py-5 lg:py-4 hover:bg-slate-50/40 transition-colors group gap-4 lg:gap-0 ${offer.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                <div className="flex-1 flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    {offer.imageUrl ? (
                      <img 
                        src={offer.imageUrl} 
                        alt={offer.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={24} /></div>
                    )}
                  </div>
                  <div className="min-w-0 pr-4">
                    <p className="font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-600 transition-colors truncate">{offer.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 tracking-wider uppercase">ID: {offer.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:contents gap-4 pt-4 lg:pt-0 border-t border-slate-50 lg:border-none">
                  <div className="lg:w-32 flex flex-col lg:block">
                    <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</span>
                    <span className="inline-flex bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase">
                      {offer.category || 'General'}
                    </span>
                  </div>
                  <div className="lg:w-32 flex flex-col lg:block">
                    <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Farmer</span>
                    <span className="text-xs font-bold text-slate-600 truncate block">{offer.farmerName || 'Unknown'}</span>
                  </div>
                  <div className="lg:w-24 flex flex-col lg:block">
                    <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</span>
                    <span className="text-sm font-black text-slate-900 leading-none">₹{offer.price}</span>
                  </div>
                  <div className="lg:w-24 flex flex-col lg:block">
                    <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity Offered</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg w-fit bg-emerald-50 text-emerald-600`}>
                      {offer.stock ?? 0} {offer.unit || 'units'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-3 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-slate-50 lg:border-none">
                  <div className="lg:w-28">
                    {getStatusBadge(offer.status)}
                  </div>

                  <div className="flex items-center gap-2 lg:w-40 lg:justify-end">
                    {offer.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(offer)}
                          disabled={approvingId === offer.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                          title="Purchase Stock"
                        >
                          {approvingId === offer.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(offer)}
                          disabled={rejectingId === offer.id}
                          className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50"
                          title="Reject Offer"
                        >
                          {rejectingId === offer.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={16} />}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-300 transition-all"
                          title="Action Finished"
                        >
                          {offer.status === 'accepted' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        </button>
                      </>
                    )}
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

export default AdminSupplyOffers;
