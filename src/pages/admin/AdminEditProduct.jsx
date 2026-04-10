import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById, updateProduct, uploadToCloudinary } from '../../services/productService';
import { getCategories } from '../../services/adminService';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Loader2,
  Info,
  CheckCircle2,
  Trash2,
  Camera,
  Upload,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const units = ['kg', 'gram', 'piece', 'bundle', 'litre', 'dozen'];

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    price: '',
    stock: '',
    category: '',
    unit: 'kg',
    imageUrl: '',
    isFeatured: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        
        // Fetch categories first
        const cats = await getCategories();
        setCategories(cats && cats.length > 0 ? cats : [{ name: 'General' }]);

        // Fetch product
        const product = await getProductById(id);
        if (product) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            originalPrice: (product.originalPrice || product.price || '').toString(),
            price: (product.price || '').toString(),
            stock: (product.stock || '0').toString(),
            category: product.category || (cats && cats.length > 0 ? cats[0].name : 'General'),
            unit: product.unit || 'kg',
            imageUrl: product.image || product.imageUrl || '',
            isFeatured: !!product.isFeatured
          });
        } else {
          toast.error('Product not found');
          navigate('/admin/products');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load product data');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      toast.success('Image updated successfully!');
    } catch (error) {
      toast.error('Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      return toast.error('Please provide a product image');
    }

    setLoading(true);
    try {
      // Find the selected category object to get its correct slug
      const selectedCatObj = categories.find(c => c.name === formData.category);
      const categorySlug = selectedCatObj ? selectedCatObj.slug : formData.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

      const productData = {
        ...formData,
        categorySlug, // Use the real slug
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.imageUrl // Ensure field matches public expected field if inconsistent
      };

      await updateProduct(id, productData);
      toast.success('Retail product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 size={48} className="animate-spin text-emerald-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Fetching Product Detail...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/products" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-1" /> Back to Storefront Catalog
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Retail Product</h2>
          <p className="text-slate-500 font-medium mt-1">Modify details for <span className="text-emerald-600">ID: {id.slice(0, 8).toUpperCase()}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-50">General Information</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Product Name</label>
              <input 
                type="text" required name="name"
                placeholder="e.g. Organic Red Tomatoes"
                className="input-field w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm text-slate-700"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
              <textarea 
                required name="description"
                rows="4"
                placeholder="Tell customers what's special about this product..."
                className="resize-none h-32 w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm text-slate-700"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                <select 
                  name="category"
                  className="w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-bold text-sm text-slate-700"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Base Unit</label>
                <select 
                  name="unit"
                  className="w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-bold text-sm text-slate-700"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-50 flex items-center gap-2">
              <Save size={20} className="text-emerald-500" />
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">MRP Price (₹)</label>
                <div className="relative">
                  <input 
                    type="number" name="originalPrice"
                    placeholder="0.00"
                    className="w-full rounded-2xl bg-slate-50 border-none py-3.5 pl-9 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm text-slate-700"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Selling Price (₹)</label>
                <div className="relative">
                  <input 
                    type="number" required name="price"
                    placeholder="0.00"
                    className="w-full rounded-2xl bg-emerald-50/10 border border-emerald-100 py-3.5 pl-9 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm text-emerald-900"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">₹</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Warehouse Stock</label>
                <input 
                  type="number" required name="stock"
                  placeholder="0"
                  className="w-full rounded-2xl bg-slate-50 border-none py-3.5 px-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm text-slate-700"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formData.originalPrice && formData.price && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <p className="text-sm font-bold text-emerald-800">
                  Visible Discount: <span className="text-emerald-600 font-black">
                    {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-50 flex items-center gap-2">
              <Camera size={20} className="text-emerald-500" />
              Product Photo
            </h3>
            
            <div className="space-y-4">
              <div 
                className={`relative group aspect-square rounded-[2rem] overflow-hidden border-2 border-dashed transition-all duration-300 ${
                  formData.imageUrl ? 'border-emerald-500' : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                }`}
              >
                {formData.imageUrl ? (
                  <>
                    <img 
                      src={formData.imageUrl} 
                      alt="Product preview" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-colors"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group p-8 text-center bg-slate-50/50 hover:bg-emerald-50/50 transition-all duration-300">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm aria-hidden flex items-center justify-center text-emerald-500 mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-emerald-500 group-hover:text-white">
                      {uploadingImage ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                    </div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Click to Browse Photo</span>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">PNG, JPG up to 5MB</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>

              <div className="relative">
                <input 
                  type="text" name="imageUrl"
                  className="w-full rounded-2xl bg-slate-50 border-none py-3.5 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-sm text-slate-700"
                  placeholder="Or paste internal path/external URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
             <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg">
                   <Info size={18} />
                 </div>
                 <span className="font-bold text-sm">Feature Tip</span>
               </div>
               <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                 Featured items appear at the top of category pages. Perfect for highlighting fresh stock!
               </p>
               <label className="flex items-center gap-3 cursor-pointer group">
                 <div className={`w-10 h-6 rounded-full p-1 transition-all ${formData.isFeatured ? 'bg-white' : 'bg-emerald-800'}`}>
                   <div className={`w-4 h-4 rounded-full bg-emerald-600 transform transition-transform ${formData.isFeatured ? 'translate-x-4 bg-emerald-700' : 'translate-x-0'}`} />
                 </div>
                 <input 
                    type="checkbox" name="isFeatured" 
                    className="hidden" 
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                 <span className="text-sm font-bold">Highlight as Featured</span>
               </label>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>Save Changes <Save size={18} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
