import React, { useState, useEffect } from 'react';
import { getBanners, updateBanner, addBanner, deleteBanner } from '../../services/adminService';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({ title: '', imageUrl: '', link: '', isActive: true });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setCurrentBanner(banner);
      setFormData({ title: banner.title, imageUrl: banner.imageUrl, link: banner.link, isActive: banner.isActive });
    } else {
      setCurrentBanner(null);
      setFormData({ title: '', imageUrl: '', link: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBanner) {
        await updateBanner(currentBanner.id, formData);
        toast.success('Banner updated');
      } else {
        await addBanner(formData);
        toast.success('Banner added');
      }
      setShowModal(false);
      fetchBanners();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await deleteBanner(id);
      setBanners(banners.filter(b => b.id !== id));
      toast.success('Banner deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Home Promotions</h1>
          <p className="text-slate-500 font-medium mt-1">Manage marketing banners and homepage offers</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add New Promotion
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search promotions by title..." 
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banners.filter(b => b.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())).map((banner) => (
            <div key={banner.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all">
               <div className="aspect-[21/9] relative overflow-hidden bg-slate-100">
                  <img 
                    src={banner.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                    decoding="async"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
                     <div className="text-white">
                        <h3 className="text-2xl font-black">{banner.title}</h3>
                        <p className="text-slate-200 text-xs font-medium uppercase tracking-widest mt-2">{banner.link}</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-6 flex items-center justify-between">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    banner.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => handleOpenModal(banner)}
                       className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                     >
                        <Edit3 size={18} />
                     </button>
                     <button 
                        onClick={() => handleDelete(banner.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                     >
                        <Trash2 size={18} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Placeholder - Simplistic for brevity but functional */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
           <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-black text-slate-900">{currentBanner ? 'Edit Promotion' : 'New Promotion'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Banner Title</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="url" required
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Link</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                    />
                 </div>
                 <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-emerald-500 rounded-lg"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <span className="font-black text-slate-600 text-xs uppercase tracking-widest">Show on homepage</span>
                 </label>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-xs uppercase text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                    <button type="submit" className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100">Save promotion</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
