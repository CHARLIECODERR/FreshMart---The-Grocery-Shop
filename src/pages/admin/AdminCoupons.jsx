import React, { useState, useEffect } from 'react';
import { getCoupons, addCoupon, deleteCoupon, updateCoupon } from '../../services/adminService';
import { 
  Plus, Search, Trash2, Edit3, Loader2, Calendar, Percent, X, Check, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [formData, setFormData] = useState({ code: '', discount: '', expiry: '', description: '', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({ 
        code: coupon.code, 
        discount: coupon.discount, 
        expiry: coupon.expiry || '', 
        description: coupon.description || '', 
        isActive: coupon.isActive ?? true 
      });
    } else {
      setEditingId(null);
      setFormData({ code: '', discount: '', expiry: '', description: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await updateCoupon(editingId, formData);
        toast.success('Coupon updated successfully');
      } else {
        await addCoupon(formData);
        toast.success('Coupon created successfully');
      }
      setShowModal(false);
      fetchCoupons();
    } catch {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success('Coupon deleted');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const handleDuplicate = (coupon) => {
    setEditingId(null);
    setFormData({ 
      ...coupon, 
      code: `${coupon.code}_COPY`,
      id: undefined 
    });
    setShowModal(true);
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Promotional Codes</h1>
          <p className="text-slate-500 font-medium mt-1">Manage platform-wide discount strategies</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Create New Coupon
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by coupon code..." 
            className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-32">
           <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {coupons.filter(c => c.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase())).map((coupon) => (
            <div key={coupon.id} className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all">
               <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-[#f8fafc] border border-slate-100 shadow-inner" />
               <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 rounded-full bg-[#f8fafc] border border-slate-100 shadow-inner" />
               
               <div className="p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
                     <Percent size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{coupon.code}</h3>
                  <p className="text-emerald-600 font-black text-base uppercase tracking-widest mb-3">{coupon.discount}% FLAT OFF</p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 w-full space-y-4">
                     <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <Calendar size={14} />
                        Expires: {coupon.expiry || 'No Expiry'}
                     </div>
                     <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                       coupon.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                     }`}>
                       {coupon.isActive ? 'Active & Live' : 'Disabled'}
                     </span>
                  </div>
               </div>
               
               <div className="px-8 py-5 bg-slate-50 flex justify-center gap-3 border-t border-slate-100">
                  <button onClick={() => handleDelete(coupon.id)} className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-red-500 hover:shadow-md transition-all" title="Delete"><Trash2 size={16} /></button>
                  <button onClick={() => handleOpenModal(coupon)} className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-emerald-500 hover:shadow-md transition-all" title="Edit"><Edit3 size={16} /></button>
                  <button onClick={() => handleDuplicate(coupon)} className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-blue-500 hover:shadow-md transition-all" title="Duplicate"><Copy size={16} /></button>
               </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
           <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Update Coupon' : 'Create Coupon'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Coupon Code</label>
                    <input type="text" required placeholder="e.g. FRESH50" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 font-black uppercase transition-all" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Discount %</label>
                      <input type="number" required max="100" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 font-bold transition-all" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Expiry Date</label>
                      <input type="date" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 font-bold transition-all text-xs" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Internal Description</label>
                    <input type="text" placeholder="e.g. Summer Special" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 font-medium transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 </div>
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isActive ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white'}`}>
                      {formData.isActive && <Check size={14} className="text-white" />}
                      <input type="checkbox" className="hidden" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                    </div>
                    <span className="font-black text-slate-500 text-xs uppercase tracking-widest group-hover:text-slate-900 transition-colors">Visible to users</span>
                 </label>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-xs uppercase text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                    <button type="submit" disabled={saving} className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2">
                       {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                       {editingId ? 'Update' : 'Activate'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
