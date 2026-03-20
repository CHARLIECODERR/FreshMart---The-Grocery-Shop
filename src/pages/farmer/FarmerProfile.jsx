import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  Store, 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const FarmerProfile = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    farmName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
    avatarUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              displayName: data.displayName || '',
              email: data.email || '',
              phoneNumber: data.phoneNumber || '',
              farmName: data.farmName || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              pincode: data.pincode || '',
              description: data.description || '',
              avatarUrl: data.avatarUrl || ''
            });
          }
        }
      } catch (error) {
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, profile);
      toast.success("Store credentials updated");
    } catch (error) {
      toast.error("Cloud synchronization failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Retrieving Secure Credentials...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 space-y-12 animate-in fade-in duration-700 max-w-[1200px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Authorized Store</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your official farm identity and marketplace presence</p>
        </div>
        <div className="flex bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 items-center gap-3">
          <ShieldCheck className="text-emerald-600" size={24} />
          <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">
             Verification Status: <span className="text-emerald-900 underline block mt-1">CERTIFIED MERCHANT</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="xl:col-span-1 space-y-8">
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 shadow-inner bg-gradient-to-r from-emerald-400 to-emerald-600" />
              
              <div className="relative mb-10 inline-block">
                 <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center text-slate-200 overflow-hidden relative group-hover:rotate-3 transition-transform duration-500">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} />
                    )}
                 </div>
                 <button type="button" className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
                    <Camera size={18} />
                 </button>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2 truncate">{profile.displayName || 'Authorized Farmer'}</h2>
              <p className="text-sm font-bold text-slate-400 mb-8">{profile.email}</p>
              
              <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-black text-emerald-600 italic">
                        {userData?.averageRating ? userData.averageRating.toFixed(1) : '5.0'} ★
                      </p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">
                        {userData?.reviewCount || 0} reviews
                      </p>
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
                    <p className="text-sm font-black text-emerald-600 italic">ELITE</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24" />
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-6 border-b border-white/10 pb-4">Merchant Notice</h4>
              <p className="text-xs text-white/60 font-medium leading-relaxed italic">
                 Update your farm name and description often to maintain engagement. Verified changes sync to the global catalog within 180 seconds.
              </p>
           </div>
        </div>

        {/* Edit Form */}
        <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-10 lg:p-14">
           <div className="space-y-12">
              <section>
                 <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Store className="text-emerald-500" size={24} /> 
                    Store Information
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Official Farm Name</label>
                       <div className="relative">
                          <input 
                            type="text"
                            value={profile.farmName}
                            onChange={(e) => setProfile({...profile, farmName: e.target.value})}
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all italic"
                            placeholder="e.g. Green Valley Organics"
                          />
                          <Building className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200" size={20} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Contact Phone</label>
                       <div className="relative">
                          <input 
                            type="text"
                            value={profile.phoneNumber}
                            onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                            placeholder="+91 00000 00000"
                          />
                          <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200" size={20} />
                       </div>
                    </div>
                 </div>
              </section>

              <section>
                 <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <MapPin className="text-emerald-500" size={24} /> 
                    Operational HQ
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-3 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Physical Landmark / Address</label>
                       <input 
                         type="text"
                         value={profile.address}
                         onChange={(e) => setProfile({...profile, address: e.target.value})}
                         className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">City</label>
                       <input 
                         type="text"
                         value={profile.city}
                         onChange={(e) => setProfile({...profile, city: e.target.value})}
                         className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">State</label>
                       <input 
                         type="text"
                         value={profile.state}
                         onChange={(e) => setProfile({...profile, state: e.target.value})}
                         className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Pincode</label>
                       <input 
                         type="text"
                         value={profile.pincode}
                         onChange={(e) => setProfile({...profile, pincode: e.target.value})}
                         className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                       />
                    </div>
                 </div>
              </section>

              <section>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Farm Pitch / Description</label>
                    <textarea 
                      value={profile.description}
                      onChange={(e) => setProfile({...profile, description: e.target.value})}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all resize-none"
                      placeholder="Tell customers about your harvest methods, organic certifications, and farm legacy..."
                    />
                 </div>
              </section>

              <button 
                type="submit"
                disabled={saving}
                className="w-full lg:w-fit px-12 py-5 bg-slate-900 text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Synchronize Cloud Profile
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default FarmerProfile;
