import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Mail, Phone, Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LogoutConfirmModal from '../../components/LogoutConfirmModal';

const Account = () => {
  const { currentUser, userData, role, logout } = useAuth();
  const navigate = useNavigate();

  const [isApplying, setIsApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({ 
    businessName: '', 
    businessAddress: '',
    registrationNumber: '',
    contactPhone: '',
    farmCategory: 'Organic'
  });

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.businessAddress || !formData.registrationNumber || !formData.contactPhone) {
      return toast.error('Please fill all required fields');
    }

    try {
      setIsApplying(true);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        role: 'farmer',
        status: 'pending',
        businessName: formData.businessName,
        address: formData.businessAddress,
        registrationNumber: formData.registrationNumber,
        contactPhone: formData.contactPhone,
        farmCategory: formData.farmCategory,
        appliedAt: serverTimestamp()
      });
      toast.success('Application submitted! Pending admin approval.');
      setShowApplyForm(false);
      window.location.reload(); 
    } catch (error) {
      toast.error('Application failed');
    } finally {
      setIsApplying(false);
    }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = async () => {
    try {
      setShowLogoutModal(false);
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const menuItems = [
    { icon: Package, label: 'My Orders', desc: 'View and track your orders', path: '/account/orders', color: 'bg-blue-50 text-blue-600' },
    { icon: Heart, label: 'Wishlist', desc: 'Items you have saved for later', path: '/account/wishlist', color: 'bg-red-50 text-red-600' },
    { icon: MapPin, label: 'Addresses', desc: 'Manage your shipping addresses', path: '/account/addresses', color: 'bg-orange-50 text-orange-600' },
    { icon: Settings, label: 'Settings', desc: 'Update profile and password', path: '/account/settings', color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-500 font-medium">Manage your profile and orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 text-3xl font-black border-4 border-emerald-50">
              {currentUser?.displayName?.charAt(0) || <User size={40} />}
            </div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">
              {currentUser?.displayName || 'Welcome Back!'}
            </h2>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1 mb-6">
              {role} Account
            </p>
            <div className="w-full space-y-4 text-left border-t border-gray-50 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{currentUser?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{currentUser?.phoneNumber || '+91 Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-400" />
                <span>Joined March 2026</span>
              </div>
            </div>
            <button onClick={handleLogoutClick} className="mt-10 w-full flex items-center justify-center gap-2 text-red-500 font-black text-sm hover:bg-red-50 py-3 rounded-2xl transition-colors border border-red-50">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item, idx) => (
              <Link key={idx} to={item.path} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:border-emerald-100 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <item.icon size={24} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-gray-900">{item.label}</h3>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-gray-400 mt-1 font-medium">{item.desc}</p>
              </Link>
            ))}
          </div>

          {role === 'customer' && (
            <div className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Grow with FreshMart</h3>
                <p className="text-emerald-50 text-sm font-medium leading-relaxed mb-6 opacity-90">
                  Ready to sell your fresh produce directly to customers? Join our community of 50+ local farmers.
                </p>
                {showApplyForm ? (
                  <form onSubmit={handleApply} className="space-y-4 animate-in slide-in-from-bottom duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Farm Name" className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white placeholder:text-emerald-100/50 focus:ring-2 focus:ring-white outline-none" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} required />
                      <input type="text" placeholder="Registration/License No." className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white placeholder:text-emerald-100/50 focus:ring-2 focus:ring-white outline-none" value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} required />
                      <input type="tel" placeholder="Contact Phone" className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white placeholder:text-emerald-100/50 focus:ring-2 focus:ring-white outline-none" value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} required />
                      <select className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-white outline-none appearance-none cursor-pointer" value={formData.farmCategory} onChange={(e) => setFormData({...formData, farmCategory: e.target.value})}>
                        <option value="Organic" className="text-gray-900">Organic Farm</option>
                        <option value="Dairy" className="text-gray-900">Dairy Producer</option>
                        <option value="Poultry" className="text-gray-900">Poultry Farm</option>
                        <option value="Fruits/Veg" className="text-gray-900">Fruits & Vegetables</option>
                      </select>
                    </div>
                    <input type="text" placeholder="Farm Location/Address" className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white placeholder:text-emerald-100/50 focus:ring-2 focus:ring-white outline-none" value={formData.businessAddress} onChange={(e) => setFormData({...formData, businessAddress: e.target.value})} required />
                    <div className="flex gap-3">
                      <button type="submit" disabled={isApplying} className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-colors flex-1">
                        {isApplying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button type="button" onClick={() => setShowApplyForm(false)} className="bg-emerald-700/50 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setShowApplyForm(true)} className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all shadow-lg hover:translate-y-[-2px]">
                    Start Selling Now
                  </button>
                )}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            </div>
          )}

          {role === 'farmer' && userData?.status === 'pending' && (
            <div className="mt-8 bg-orange-50 rounded-3xl p-8 border border-orange-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                <Clock className="animate-pulse" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black text-orange-900">Application Under Review</h3>
                <p className="text-sm text-orange-600 font-medium">Our team is verifying your farm details. You'll get access to the Farmer Dashboard as soon as you're approved!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
