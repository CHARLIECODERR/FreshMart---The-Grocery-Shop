import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { setDocument } from '../../firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { 
  User, 
  Store, 
  Phone, 
  MapPin, 
  FileText, 
  Save, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerProfile = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    storeName: userData?.storeName || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    bio: userData?.bio || '',
    categories: userData?.categories || ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: currentUser?.displayName || '',
        storeName: userData.storeName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        bio: userData.bio || '',
        categories: userData.categories || ''
      });
    }
  }, [userData, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Auth Profile (Display Name)
      if (formData.fullName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: formData.fullName
        });
      }

      // 2. Update Firestore Document
      const updatedData = {
        ...userData,
        storeName: formData.storeName,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        categories: formData.categories,
        updatedAt: new Date().toISOString()
      };

      await setDocument('users', currentUser.uid, updatedData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-10 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Market Profile</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your public presence and farm information</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          <CheckCircle2 size={16} /> Verified Producer
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Overview */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 border-4 border-white shadow-xl group-hover:bg-emerald-50 transition-colors">
                <User size={64} />
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all hover:scale-110 active:scale-95">
                <Camera size={20} />
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-900">{currentUser?.displayName || 'Farmer'}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Farmer Access</p>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
             <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="text-emerald-400" size={20} />
                <h4 className="font-black text-sm uppercase tracking-widest">Visibility Tip</h4>
             </div>
             <p className="text-slate-400 text-xs leading-relaxed">
                Profiles with complete descriptions and store names receive <span className="text-emerald-400 font-black">40% more orders</span> on average.
             </p>
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
            {/* Group 1: Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <Store className="text-emerald-500" size={20} />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Store Identity</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Representative Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store / Farm Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                    placeholder="e.g. Green Valley Organic"
                  />
                </div>
              </div>
            </div>

            {/* Group 2: Reach */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <Phone className="text-emerald-500" size={20} />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Reach & Logistics</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Farm Categories</label>
                  <input
                    type="text"
                    name="categories"
                    value={formData.categories}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                    placeholder="e.g. Vegetables, Dairy, Spices"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin size={12} /> Pickup Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all resize-none"
                  placeholder="Full physical address for pickup logistics"
                />
              </div>
            </div>

            {/* Group 3: Story */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <FileText className="text-emerald-500" size={20} />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Farmer Story</h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marketplace Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all resize-none"
                  placeholder="Tell your customers about your farming practices and story..."
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white rounded-[1.5rem] py-5 font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {loading ? 'Committing Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FarmerProfile;
