import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory, getProductCountByCategory } from '../../services/adminService';
import { 
  Layers, Plus, Search, Edit3, Trash2, X, Loader2, Inbox, Check, RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productCounts, setProductCounts] = useState({});
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [cats, counts] = await Promise.all([getCategories(), getProductCountByCategory()]);
      setCategories(cats || []);
      setProductCounts(counts || {});
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setEditingCategory(null); setFormName(''); setFormSlug(''); setShowModal(true); };
  const openEdit = (cat) => { setEditingCategory(cat); setFormName(cat.name); setFormSlug(cat.slug || ''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingCategory(null); };

  const handleNameChange = (val) => {
    setFormName(val);
    if (!editingCategory) setFormSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return toast.error('Category name is required');
    try {
      setSaving(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: formName, slug: formSlug });
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: formName, slug: formSlug } : c));
        toast.success('Category updated!');
      } else {
        const newCat = await addCategory({ name: formName, slug: formSlug });
        setCategories(prev => [...prev, newCat]);
        toast.success('Category added!');
      }
      closeModal();
    } catch {
      toast.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.id);
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleSeedDefaults = async () => {
    const defaults = [
      { name: 'Fresh Fruits', slug: 'fresh-fruits', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80', order: 1, isActive: true },
      { name: 'Vegetables', slug: 'vegetables', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80', order: 2, isActive: true },
      { name: 'Dairy & Eggs', slug: 'dairy-eggs', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80', order: 3, isActive: true },
      { name: 'Meat & Poultry', slug: 'meat-poultry', imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80', order: 4, isActive: true },
      { name: 'Bakery', slug: 'bakery', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80', order: 5, isActive: true }
    ];

    try {
      setSaving(true);
      toast.loading('Seeding standard categories...', { id: 'seed' });
      await Promise.all(defaults.map(cat => addCategory(cat)));
      toast.success('Categories synchronized!', { id: 'seed' });
      fetchAll();
    } catch (error) {
      toast.error('Sync failed', { id: 'seed' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = categories.filter(c => c.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 font-medium mt-1">{categories.length} total categories</p>
        </div>
        <button onClick={openAdd} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> New Category
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input type="text" placeholder="Search categories..." className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-32"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-32 text-center border border-slate-100 flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
             <Inbox size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">No Categories Found</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2 text-sm">Synchronize defaults to start.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={openAdd} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all">Custom</button>
            <button onClick={handleSeedDefaults} disabled={saving} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />} Sync Defaults
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <div key={cat.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 group transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Layers size={24} />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(cat)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-500"><Edit3 size={16} /></button>
                  <button onClick={() => handleDelete(cat)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-400 font-medium mb-3">Slug: {cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}</p>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{productCounts[cat.name] || 0} Products</span>
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black text-slate-900 mb-6">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" value={formName} onChange={e => handleNameChange(e.target.value)} placeholder="Name" className="w-full border rounded-2xl px-4 py-3" required />
              <input type="text" value={formSlug} onChange={e => setFormSlug(e.target.value)} placeholder="Slug" className="w-full border rounded-2xl px-4 py-3" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3.5 rounded-2xl border font-bold">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
