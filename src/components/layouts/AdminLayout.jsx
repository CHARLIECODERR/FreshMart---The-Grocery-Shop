import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  Package, 
  Layers,
  ShoppingBag, 
  Image as ImageIcon,
  Tag,
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Store,
  ShieldCheck,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import LogoutConfirmModal from '../LogoutConfirmModal';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: 'Back to Homepage', path: '/', icon: Store },
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Farmers', path: '/admin/farmers', icon: UserPlus },
    { name: 'Global Catalog', path: '/admin/products', icon: Package },
    { name: 'All Categories', path: '/admin/categories', icon: Layers },
    { name: 'All Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Home Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
    { name: 'Logout', path: '#logout', icon: LogOut, isLogout: true },
  ];

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = async () => {
    try {
      setShowLogoutModal(false);
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path) => {
    if (path === '#logout') return false;
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  const handleBack = () => {
    if (location.pathname === '/admin') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white rounded-2xl p-2 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-white">
              FM <span className="text-emerald-500">Admin</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto pb-4">
          {menuItems.map((item) => (
            item.isLogout ? (
              <button
                key={item.name}
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all mt-4 border-t border-slate-800 pt-6"
              >
                <LogOut size={20} />
                {item.name}
              </button>
            ) : (
              <Link key={item.name} to={item.path} className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive(item.path) ? 'text-emerald-400' : 'text-slate-500'} />
                  {item.name}
                </div>
              </Link>
            )
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm relative z-20">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
               <Menu size={24} />
             </button>
             <span className="font-black text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
               FM <span className="text-emerald-600">Admin</span>
             </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100" title="Back to Homepage">
               <Store size={18} />
            </Link>
            <button onClick={handleLogoutClick} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
               <LogOut size={22} />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
           <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
              <aside className="relative w-72 max-w-sm bg-slate-900 text-slate-300 flex flex-col shadow-2xl h-full">
                 <div className="p-6 flex items-center justify-between">
                    <span className="text-xl font-black text-white">FM <span className="text-emerald-500">Admin</span></span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
                 </div>
                 <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2 pb-4">
                    {menuItems.map((item) => (
                      item.isLogout ? (
                        <button
                          key={item.name}
                          onClick={() => { setIsMobileMenuOpen(false); handleLogoutClick(); }}
                          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-4 border-t border-slate-800 pt-6"
                        >
                          <LogOut size={20} />
                          {item.name}
                        </button>
                      ) : (
                        <Link 
                          key={item.name} 
                          to={item.path} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={20} className={isActive(item.path) ? 'text-emerald-400' : 'text-slate-500'} />
                            {item.name}
                          </div>
                        </Link>
                      )
                    ))}
                 </nav>
              </aside>
           </div>
        )}

        <main className="p-4 lg:p-10 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
