import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Store,
  ChevronRight,
  TrendingUp,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import LogoutConfirmModal from '../LogoutConfirmModal';
import { useTranslation } from 'react-i18next';
import FarmerVerification from '../../pages/farmer/FarmerVerification';

const FarmerLayout = () => {
  const { t } = useTranslation();
  const { currentUser, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isUnderReview = userData?.status === 'under_review';
  const isVerified = userData?.status === 'active';

  const menuItems = [
    { name: t('farmer.back_to_home'), path: '/', icon: Store },
    ...(isVerified ? [
      { name: t('farmer.navigation.dashboard'), path: '/farmer', icon: LayoutDashboard },
      { name: t('farmer.navigation.products'), path: '/farmer/products', icon: Package },
      { name: t('farmer.navigation.orders'), path: '/farmer/orders', icon: ShoppingBag },
    ] : isUnderReview ? [
      { name: 'Dashboard', path: '/farmer', icon: LayoutDashboard }
    ] : [
      { name: 'Business KYC', path: '/farmer', icon: LayoutDashboard }
    ])
  ];

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = async () => {
    try {
      setShowLogoutModal(false);
      navigate('/login', { replace: true });
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const isActive = (path) => {
    if (path === '/') return false;
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row">
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
      {/* Mobile Header - More Premium like Admin */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl p-1.5 border border-slate-100 shadow-sm">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black text-slate-900">
            FM <span className="text-emerald-600">Farmer</span>
          </span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 text-slate-300 z-[60] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl p-2 shadow-lg">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-2xl font-black text-white">FM <span className="text-emerald-500">Farmer</span></span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-white/5 rounded-3xl p-5 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                    <User size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1.5">Farmer Profile</p>
                    <p className="text-sm font-bold text-white truncate">{currentUser?.displayName || t('farmer.farmer_access')}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-1 mt-2">
                {menuItems.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <item.icon size={20} className={isActive(item.path) ? 'text-emerald-400' : 'text-slate-500'} /> {item.name}
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-slate-800">
                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={20} /> {t('farmer.logout_session')}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Dark Theme like Admin */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-slate-300 sticky top-0 h-screen flex-shrink-0">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white rounded-2xl p-2 group-hover:rotate-6 transition-transform duration-300 shadow-lg shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <span className="text-2xl font-black text-white leading-none block">FM <span className="text-emerald-500">Farmer</span></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mt-1">Farmer Partner</span>
            </div>
          </Link>
        </div>

        <Link to="/farmer/profile" className="px-6 mb-8 mt-4 block group/usercard">
          <div className="bg-white/5 rounded-[2rem] p-5 flex items-center gap-4 border border-white/10 shadow-inner group-hover/usercard:bg-white/10 group-hover/usercard:border-emerald-500/30 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-700 shadow-sm shrink-0 group-hover/usercard:border-emerald-500/50 transition-colors">
              <User size={24} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">Farmer Profile</p>
              <p className="text-sm font-bold text-white truncate max-w-full" title={currentUser?.displayName || t('farmer.farmer_profile')}>
                {currentUser?.displayName || t('farmer.farmer_profile')}
              </p>
            </div>
          </div>
        </Link>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`flex items-center gap-3.5 px-6 py-4 rounded-2xl text-sm font-bold transition-all group/nav ${isActive(item.path) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} className={`transition-colors ${isActive(item.path) ? 'text-emerald-400' : 'text-slate-500 group-hover/nav:text-slate-300'}`} /> 
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={16} /> {t('farmer.logout_access')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        <main className="p-6 sm:p-10 max-w-[1600px] w-full mx-auto">
          {(!isVerified && !isUnderReview) ? <FarmerVerification /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;
