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
  LogOut,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import LogoutConfirmModal from './LogoutConfirmModal';
import NotificationCenter from './NotificationCenter';
import toast from 'react-hot-toast';
import { useSettings } from '../hooks/useSettings';
import LanguageSelector from './common/LanguageSelector';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { t } = useTranslation();
  const { currentUser, role, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const storeName = settings?.general?.storeName || 'FreshMart';

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
    { name: t('nav.home'), path: '/' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.categories'), path: '/categories' },
    { name: t('nav.offers'), path: '/offers' },
    { name: t('nav.recipes'), path: '/recipes' },
    { name: t('nav.about'), path: '/about' },
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
              <img src="/logo.png" alt={`${storeName} Logo`} className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              {storeName.includes('Fresh') ? (
                <>Fresh<span className="text-emerald-600">{storeName.replace('Fresh', '')}</span></>
              ) : (
                <span className="text-emerald-600">{storeName}</span>
              )}
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
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            {currentUser && <NotificationCenter />}
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
                  title={t('auth.sign_out')}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/farmer-signup" className="hidden sm:inline-flex items-center justify-center py-2 px-4 rounded-xl border border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors">Become a Farmer</Link>
                <Link to="/login" className="btn-primary !py-2 !px-4 sm:!px-5 text-xs sm:text-sm whitespace-nowrap">{t('auth.sign_in')}</Link>
              </div>
            )}
            <button className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[70] md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg p-1">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-lg text-slate-900">{storeName}</span>
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageSelector />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.path) 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-100 px-4">
                  <Link 
                    to="/account/wishlist" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <Heart size={20} />
                    <span className="font-medium">{t('common.wishlist')}</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                {currentUser ? (
                  <div className="space-y-3">
                    <Link 
                      to={role === 'admin' ? '/admin' : role === 'farmer' ? '/farmer' : '/account'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-2xl hover:border-emerald-200 transition-colors shadow-sm"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 flex-shrink-0">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {currentUser.displayName || t('auth.my_account')}
                        </p>
                        <p className="text-xs text-gray-500 truncate capitalize">{role}</p>
                      </div>
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-2xl transition-all"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all text-lg"
                    >
                      {t('auth.sign_in')}
                    </Link>
                    <Link 
                      to="/farmer-signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center py-4 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold rounded-2xl transition-all text-lg"
                    >
                      Become a Farmer
                    </Link>
                    <p className="text-center text-sm text-gray-500">
                      {t('auth.dont_have_account')} <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-600 font-bold hover:underline">{t('auth.sign_up')}</Link>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
