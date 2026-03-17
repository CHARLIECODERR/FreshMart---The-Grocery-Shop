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

const FarmerLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
    { name: 'Products', path: '/farmer/products', icon: Package },
    { name: 'Orders', path: '/farmer/orders', icon: ShoppingBag },
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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg p-1 border border-emerald-100/50">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black text-emerald-600">FreshMart</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
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
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[60] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl p-1.5 border border-emerald-100/50">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-2xl font-black text-emerald-600">FreshMart</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-4 border border-emerald-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Seller Access</p>
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{currentUser?.displayName || 'Farmer'}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <item.icon size={20} /> {item.name}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t">
                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <LogOut size={20} /> Sign Out Account
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col bg-white border-r sticky top-0 h-screen overflow-y-auto">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-emerald-50 rounded-[1.25rem] p-2.5 group-hover:rotate-6 transition-transform duration-500 shadow-sm border border-emerald-100/50 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-2xl font-black text-emerald-600 tracking-tighter truncate">FreshMart</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Farmer Dashboard</span>
            </div>
          </Link>
        </div>

        <div className="px-8 mb-10">
          <div className="bg-slate-50 rounded-3xl p-5 flex items-center gap-4 border border-slate-100/50 shadow-inner">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm shrink-0">
              <User size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5 font-display">Authorized</p>
              <p className="text-sm font-bold text-slate-900 truncate font-display">{currentUser?.displayName || 'Farmer'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-5 space-y-2.5">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`flex items-center gap-3.5 px-6 py-4 rounded-2xl text-sm font-black transition-all group/nav ${isActive(item.path) ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 translate-x-1' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'}`}
            >
              <item.icon size={20} className={`transition-transform duration-300 ${isActive(item.path) ? 'text-white' : 'group-hover/nav:scale-110'}`} /> {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t bg-slate-50/30">
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border-2 border-transparent hover:border-red-100"
          >
            <LogOut size={16} /> Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        <main className="p-6 sm:p-10 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;
