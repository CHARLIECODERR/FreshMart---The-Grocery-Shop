import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Save } from 'lucide-react';

const ProfileTab = ({ 
  profileData, 
  setProfileData, 
  handleProfileUpdate, 
  handleImageUpload, 
  uploading, 
  loading,
  currentUser 
}) => {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12"
    >
      <form onSubmit={handleProfileUpdate} className="space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center text-emerald-600 text-4xl font-black overflow-hidden relative">
               {uploading ? (
                 <div className="animate-spin text-emerald-600"><Upload size={32} /></div>
               ) : profileData.photoURL ? (
                 <img src={profileData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 currentUser?.displayName?.charAt(0) || 'U'
               )}
               <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs cursor-pointer">
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  <Camera size={24} />
               </label>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-50 flex items-center justify-center text-emerald-600">
              <Camera size={18} />
            </div>
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500 font-medium max-w-sm">Update your photo for a more personalized experience on FreshMart.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Display Name</label>
            <input 
              type="text" 
              value={profileData.displayName}
              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
              className="w-full bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
            <input 
              type="tel" 
              value={profileData.phoneNumber}
              onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
              className="w-full bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium"
              placeholder="+91 00000 00000"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Bio / Story</label>
          <textarea 
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            className="w-full bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl py-4 px-6 outline-none transition-all font-medium min-h-[120px] resize-none"
            placeholder="Tell us a bit about yourself..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full md:w-auto px-12 py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <Save size={18} /> {loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </motion.div>
  );
};

export default React.memo(ProfileTab);
