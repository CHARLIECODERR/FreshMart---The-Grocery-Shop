import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../../services/adminService';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Store, 
  MapPin, 
  Truck,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers('farmer');
      setFarmers(data);
    } catch (error) {
      toast.error('Failed to load farmer network');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (farmerId, newStatus) => {
    try {
      await updateUserStatus(farmerId, newStatus);
      setFarmers(farmers.map(f => f.id === farmerId ? { ...f, status: newStatus } : f));
      toast.success(`Farmer status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = f.displayName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         f.businessName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || f.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Farmer Network</h1>
          <p className="text-slate-500 font-medium mt-1">Audit and manage registered farm partners</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                 <Store size={20} />
              </div>
              <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Farms</p>
                 <p className="text-lg font-black text-slate-900 leading-none">{farmers.filter(f => f.status === 'active').length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search farm or owner name..." 
            className="w-full bg-white border-none rounded-2xl py-5 pl-14 pr-6 shadow-sm focus:ring-2 focus:ring-emerald-500 font-medium text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex gap-2">
           {['All', 'active', 'pending', 'blocked'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                 filter === f 
                 ? 'bg-slate-900 text-white shadow-lg' 
                 : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* Farmer Grid */}
      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-slate-400 p-20 bg-white rounded-[2.5rem] border border-slate-100">
           <Loader2 className="animate-spin text-emerald-500" size={48} />
           <p className="text-[10px] font-black uppercase tracking-[0.3em]">Connecting to Producer DB...</p>
        </div>
      ) : filteredFarmers.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-20 bg-white rounded-[2.5rem] border border-slate-100">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
              <Store size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">Network Segment Empty</h3>
           <p className="text-slate-400 font-medium max-w-xs mx-auto">No farmers match the selected visibility parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {filteredFarmers.map((farmer) => (
             <div key={farmer.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                <div className="p-8">
                   <div className="flex items-start justify-between mb-8">
                      <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-4xl font-black border-4 border-white shadow-2xl overflow-hidden">
                         {farmer.photoURL ? (
                            <img 
                              src={farmer.photoURL} 
                              alt="" 
                              className="w-full h-full object-cover" 
                              loading="lazy"
                              decoding="async"
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            farmer.displayName?.charAt(0)
                          )}
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        farmer.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        farmer.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                         {farmer.status || 'pending'}
                      </span>
                   </div>

                   <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{farmer.businessName || 'Unnamed Farm'}</h3>
                   <p className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                     <ShieldCheck size={16} className="text-emerald-500" />
                     {farmer.displayName}
                   </p>

                   <div className="space-y-3 pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                           <MapPin size={14} />
                         </div>
                         <span className="truncate">{farmer.address || 'Address not provided'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                           <ShieldCheck size={14} />
                         </div>
                         <span>Reg: {farmer.registrationNumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                           <Phone size={14} />
                         </div>
                         <span>{farmer.contactPhone || 'No Phone'}</span>
                      </div>
                   </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 flex items-center gap-3">
                   {farmer.status === 'pending' ? (
                      <button 
                        onClick={() => handleStatusChange(farmer.id, 'active')}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                      >
                         Approve Partner
                      </button>
                   ) : farmer.status === 'active' ? (
                      <button 
                        onClick={() => handleStatusChange(farmer.id, 'blocked')}
                        className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 transition-all"
                      >
                         Suspend Access
                      </button>
                   ) : (
                      <button 
                        onClick={() => handleStatusChange(farmer.id, 'active')}
                        className="flex-1 bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-100 transition-all"
                      >
                         Re-activate
                      </button>
                   )}
                   <button 
                     onClick={() => toggleExpand(farmer.id)}
                     className={`p-4 bg-white text-slate-400 hover:text-slate-900 rounded-2xl shadow-sm hover:shadow transition-all ${expandedId === farmer.id ? 'rotate-90 bg-emerald-50 text-emerald-600' : ''}`}
                   >
                      <ChevronRight size={18} />
                   </button>
                </div>

                {expandedId === farmer.id && (
                  <div className="px-8 pb-8 bg-slate-50 animate-in slide-in-from-top duration-300">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Detail</p>
                        <p className="text-sm font-bold text-slate-900">{farmer.farmCategory || 'General'} Producer</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-sm font-bold text-slate-900">{farmer.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">UID</p>
                        <p className="text-[10px] font-bold text-slate-500 break-all">{farmer.id}</p>
                      </div>
                    </div>
                  </div>
                )}
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default AdminFarmers;
