import React, { useState, useEffect } from 'react';
import { getFarmerProducts } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  Search,
  Loader2,
  ArrowRight,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FarmerInventory = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser?.uid) fetchInventory();
  }, [currentUser]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getFarmerProducts(currentUser.uid);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockProducts = products.filter(p => !p.stock || p.stock <= 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('farmer.inventory.title')}</h1>
          <p className="text-slate-500 font-medium mt-1">{t('farmer.inventory.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={20} />
              <div>
                 <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none">{t('farmer.inventory.low_stock')}</p>
                 <p className="text-lg font-black text-orange-900">{lowStockProducts.length}</p>
              </div>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-32">
           <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
      ) : (
        <div className="space-y-8">
           {/* Critical Alerts */}
           {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-[2rem] border-l-4 border-l-orange-500 border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform">
                           <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900">{p.name}</h4>
                           <p className="text-xs font-bold text-orange-500">Only {p.stock} {p.unit} remaining</p>
                        </div>
                     </div>
                     <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowRight size={20} />
                     </button>
                  </div>
                ))}
             </div>
           )}

           {/* Inventory Master Table */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder={t('farmer.inventory.search')} 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 shadow-sm focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('farmer.inventory.table.asset')}</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('farmer.products.table.category')}</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('farmer.inventory.table.quantum')}</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('farmer.inventory.table.health')}</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('farmer.products.table.actions')}</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredProducts.map((p) => (
                         <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shadow-inner">
                                     <img src={p.image} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                     <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">₹{p.price} / {p.unit}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6 uppercase tracking-widest text-[10px] font-black text-slate-400">{p.category}</td>
                            <td className="px-10 py-6">
                               <span className="font-black text-slate-900">{p.stock}</span>
                               <span className="text-xs text-slate-400 ml-1 ml-1 font-bold">{p.unit}</span>
                            </td>
                            <td className="px-10 py-6">
                               {p.stock <= 0 ? (
                                 <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">{t('farmer.inventory.status.out')}</span>
                               ) : p.stock <= 10 ? (
                                 <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">{t('farmer.inventory.status.soon')}</span>
                               ) : (
                                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">{t('farmer.inventory.status.healthy')}</span>
                               )}
                            </td>
                            <td className="px-10 py-6 text-right">
                               <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm">
                                  <TrendingDown size={18} />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FarmerInventory;
