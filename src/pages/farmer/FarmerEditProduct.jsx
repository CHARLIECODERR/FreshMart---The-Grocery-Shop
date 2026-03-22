import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProductById, updateProduct, uploadToCloudinary } from '../../services/productService';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Loader2,
  Info,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Camera,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Grains', 'Herbs', 'Honey', 'Others'];
const units = ['kg', 'gram', 'piece', 'bundle', 'litre', 'dozen'];

const FarmerEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    price: '',
    stock: '',
    category: 'Vegetables',
    unit: 'kg',
    imageUrl: '',
    isFeatured: false,
    nutritionalInfo: '',
    benefits: '',
    storageTips: '',
    origin: '',
    season: '',
    shelfLife: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data) {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            originalPrice: data.originalPrice || data.price || '',
            price: data.price || '',
            stock: data.stock || '',
            category: data.category || 'Vegetables',
            unit: data.unit || 'kg',
            imageUrl: data.imageUrl || '',
            isFeatured: data.isFeatured || false,
            nutritionalInfo: data.nutritionalInfo || '',
            benefits: data.benefits || '',
            storageTips: data.storageTips || '',
            origin: data.origin || '',
            season: data.season || '',
            shelfLife: data.shelfLife || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/farmer/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
      toast.success('Image uploaded successfully!');
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

    setSubmitting(true);
    try {
      const productData = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        updatedAt: serverTimestamp()
      };

      await updateProduct(id, productData);
      toast.success('Product updated successfully!');
      navigate('/farmer/products');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/farmer/products" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Edit Product</h2>
          <p className="text-gray-500 font-medium text-sm">Update your listing details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 pb-4 border-b border-gray-50">General Information</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Product Name</label>
              <input 
                type="text" required name="name"
                className="input-field w-full"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Description</label>
              <textarea 
                required name="description"
                rows="4"
                className="input-field resize-none h-32 w-full"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                <select name="category" className="input-field w-full" value={formData.category} onChange={handleChange}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Base Unit</label>
                <select name="unit" className="input-field w-full" value={formData.unit} onChange={handleChange}>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 pb-4 border-b border-gray-50 flex items-center gap-2">
              <Plus size={20} className="text-emerald-500" />
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Actual Price (₹)</label>
                <div className="relative">
                  <input 
                    type="number" name="originalPrice"
                    className="input-field pl-9 w-full"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Selling Price (₹)</label>
                <div className="relative">
                  <input 
                    type="number" required name="price"
                    className="input-field pl-9 w-full border-emerald-100 bg-emerald-50/10"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">₹</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Stock</label>
                <input type="number" required name="stock" className="input-field w-full" value={formData.stock} onChange={handleChange} />
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

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 pb-4 border-b border-gray-50 flex items-center gap-2">
              <Info size={20} className="text-emerald-500" />
              Detailed Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Origin / Source</label>
                <input 
                  type="text" name="origin"
                  placeholder="e.g. Nagpur, Maharashtra"
                  className="input-field w-full"
                  value={formData.origin}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Best Season</label>
                <input 
                  type="text" name="season"
                  placeholder="e.g. Winter (Oct - Feb)"
                  className="input-field w-full"
                  value={formData.season}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Shelf Life</label>
                <input 
                  type="text" name="shelfLife"
                  placeholder="e.g. 3-5 days"
                  className="input-field w-full"
                  value={formData.shelfLife}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nutritional Info (per 100g)</label>
              <textarea 
                name="nutritionalInfo"
                rows="3"
                placeholder="e.g. Energy: 52 kcal, Vitamin C: 15%, Fiber: 2.4g"
                className="input-field resize-none h-24 w-full"
                value={formData.nutritionalInfo}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Health Benefits</label>
              <textarea 
                name="benefits"
                rows="3"
                placeholder="List some health benefits of this produce..."
                className="input-field resize-none h-24 w-full"
                value={formData.benefits}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Storage Tips</label>
              <textarea 
                name="storageTips"
                rows="3"
                placeholder="How should customers store this to keep it fresh?"
                className="input-field resize-none h-24 w-full"
                value={formData.storageTips}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 pb-4 border-b border-gray-50 flex items-center gap-2">
              <Camera size={20} className="text-emerald-500" />
              Product Photo
            </h3>
            
            <div className="space-y-4">
              <div 
                className={`relative group aspect-square rounded-[2rem] overflow-hidden border-2 border-dashed transition-all duration-300 ${
                  formData.imageUrl ? 'border-emerald-500' : 'border-gray-200 bg-gray-50 hover:border-emerald-300'
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
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group p-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 mb-4 transition-transform group-hover:scale-110">
                      {uploadingImage ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                    </div>
                    <span className="text-sm font-black text-gray-900">Change Photo</span>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">PNG, JPG up to 5MB</span>
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
                  type="url" name="imageUrl"
                  className="input-field pl-10 h-auto py-3"
                  placeholder="Or paste image URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
             <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg">
                   <Info size={18} />
                 </div>
                 <span className="font-bold text-sm">Update Tip</span>
               </div>
               <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                 Keep your stock levels accurate to prevent order cancellations and maintain high ratings.
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
                 <span className="text-sm font-bold">Featured Product</span>
               </label>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full btn-primary !py-5 text-lg flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 rounded-3xl"
          >
            {submitting ? <Loader2 className="animate-spin" /> : (
              <>Save Changes <Save size={20} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmerEditProduct;
