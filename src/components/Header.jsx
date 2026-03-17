import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Store,
  Heart,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import LogoutConfirmModal from './LogoutConfirmModal';
import toast from 'react-hot-toast';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { currentUser, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setShowLogoutModal(false);
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Offers', path: '/offers' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'
      }`}
    >
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl group-hover:rotate-6 transition-transform duration-300 p-1.5 shadow-sm border border-emerald-100/50">
              <img src="/logo.png" alt="FreshMart Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Fresh<span className="text-emerald-600">Mart</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"><Search size={20} /></button>
            <Link to="/account/wishlist" className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors hidden sm:block relative">
              <Heart size={20} />
              {wishlistCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="p-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
            </Link>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link to={role === 'admin' ? '/admin' : role === 'farmer' ? '/farmer' : '/account'} className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 border border-gray-200 rounded-full hover:border-gray-300 transition-colors">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><User size={16} /></div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{currentUser.displayName || 'Account'}</span>
                </Link>
                <button 
                  onClick={() => setShowLogoutModal(true)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex btn-primary !py-2 !px-5 text-sm">Sign In</Link>
            )}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
