import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct, toggleProductVisibility } from '../../services/adminService';
import {
  Search, Package, Trash2, Loader2, RefreshCw, ShoppingBag, Plus, Edit3, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the retail storefront? This cannot be undone.`)) return;
    try {
      setDeletingId(product.id);
      await deleteProduct(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success('Retail product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (product) => {
    try {
      await toggleProductVisibility(product.id, !product.isActive);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isActive: !product.isActive } : p));
      toast.success(`"${product.name}" is now ${!product.isActive ? 'visible' : 'hidden'} on storefront`);
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products.filter(p => {
    const matchSearch = (p.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Retail Storefront Products</h1>
          <p className="text-slate-500 font-medium mt-1">{products.length} live products available to consumers</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchProducts} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm">
            <RefreshCw size={16} /> Refresh
          </button>
          <Link to="/admin/products/new" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search store products..."
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
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-32 text-center">
            <ShoppingBag size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-900">No Retail Products Found</h3>
            <p className="text-slate-400 font-medium text-sm mt-1">Add items that you've purchased from wholesale suppliers.</p>
            <Link to="/admin/products/new" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">
              <Plus size={18} /> Create Store Item
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            <div className="hidden lg:flex items-center px-8 py-5 bg-slate-50/50">
              <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Store Product</div>
              <div className="w-32 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</div>
              <div className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Retail Price</div>
              <div className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Warehouse Stock</div>
              <div className="w-28 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visibility</div>
              <div className="w-40 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</div>
            </div>

            {filtered.map(product => (
              <div key={product.id} className="flex flex-col lg:flex-row lg:items-center px-6 lg:px-8 py-5 lg:py-4 hover:bg-slate-50/40 transition-colors group gap-4 lg:gap-0">
                <div className="flex-1 flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={24} /></div>
                    )}
                  </div>
                  <div className="min-w-0 pr-4">
                    <p className="font-black text-slate-900 text-sm leading-tight group-hover:text-emerald-600 transition-colors truncate">{product.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 tracking-wider uppercase">ID: {product.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:contents gap-4 pt-4 lg:pt-0 border-t border-slate-50 lg:border-none">
                  <div className="lg:w-32 flex flex-col lg:block">
                    <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</span>
                    <span className="inline-flex bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase">
                      {product.category || 'General'}
                    </span>
                  </div>
                  <div className="lg:w-24 flex flex-col lg:block">
                    <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Retail Price</span>
                    <span className="text-sm font-black text-slate-900 leading-none">₹{product.price}</span>
                  </div>
                  <div className="lg:w-24 flex flex-col lg:block">
                    <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Wh. Stock</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg w-fit ${(product.stock || 0) < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {product.stock ?? 0} {product.unit || 'units'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-3 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-slate-50 lg:border-none">
                  <div className="lg:w-28">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${product.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                       {product.isActive ? 'Visible' : 'Hidden'}
                     </span>
                  </div>

                  <div className="flex items-center gap-2 lg:w-40 lg:justify-end">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                      title="Edit Product"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                      title={product.isActive ? "Hide Product" : "Show Product"}
                    >
                      {product.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50"
                      title="Delete Product from Storefront"
                    >
                      {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
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

export default AdminProducts;
