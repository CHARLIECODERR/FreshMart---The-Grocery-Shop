import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFarmerProducts, deleteProduct } from '../../services/productService';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Package,
  Loader2,
  PackageSearch,
  ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const FarmerProducts = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getFarmerProducts(currentUser.uid);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* Header Section - Matched to Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Farm Inventory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage {products.length} active products in your digital store</p>
        </div>
        <Link to="/farmer/products/new" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-95">
          <Plus size={20} /> List New Product
        </Link>
      </div>

      {/* Filters & Search - Matched to Admin */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search your harvest catalog..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-widest">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Products Table - Matched to Admin */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 gap-6">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Loading Catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-32 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-200 border border-slate-100 shadow-inner">
              <PackageSearch size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-10 font-medium">Add some fresh products to your store to start selling.</p>
            <Link to="/farmer/products/new" className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">
              List First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Harvest Detail</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover" 
                              loading="lazy"
                              decoding="async"
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package size={28} />
                            </div>
                          )}
                       </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-sm group-hover:text-emerald-600 transition-colors italic">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">ID: {product.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                         {product.category}
                       </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-slate-900">₹{product.price}</span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">/ {product.unit}</span>
                        </div>
                        <span className="text-[8px] text-emerald-600 font-black uppercase tracking-widest leading-none mt-1 italic">Incl. 5% GST</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex flex-col gap-1.5">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className={product.stock < 10 ? 'text-red-500' : 'text-slate-400'}>{product.stock < 10 ? 'Low Stock' : 'Optimal'}</span>
                           <span className="text-slate-900">{product.stock} units</span>
                         </div>
                         <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full transition-all duration-1000 ${product.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                             style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                           />
                         </div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-50">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
                         {product.status || 'Active'}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/farmer/products/edit/${product.id}`}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Edit Details"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <Link 
                          to={`/product/${product.id}`} target="_blank"
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Remove Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerProducts;
