import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../hooks/useSettings';

const Footer = () => {
  const { t } = useTranslation();
  const { settings, loading } = useSettings();

  if (loading || !settings) {
    return (
      <footer className="bg-white border-t border-gray-100 py-20 flex justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </footer>
    );
  }

  const { general } = settings;

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="bg-emerald-600 text-white p-2 rounded-xl">
                <Store size={24} />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                {general.storeName}
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">{t('footer.quick_links')}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.about_us')}</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.shop_all')}</Link></li>
              <li><Link to="/categories" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.categories')}</Link></li>
              <li><Link to="/offers" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.special_offers')}</Link></li>
              <li><Link to="/farmer" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.become_farmer')}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">{t('footer.customer_service')}</h3>
            <ul className="space-y-3">
              <li><Link to="/account" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.my_account')}</Link></li>
              <li><Link to="/account/orders" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.track_order')}</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.contact_support')}</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.faqs')}</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{t('footer.privacy_policy')}</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">{t('footer.contact_us')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500">{general.address || '123 Fresh Valley Road, Green District, 45678'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-600 shrink-0" />
                <a href={`tel:${general.supportPhone}`} className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{general.supportPhone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-600 shrink-0" />
                <a href={`mailto:${general.contactEmail}`} className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">{general.contactEmail}</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {general.storeName}. {t('footer.all_rights')}
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-400 font-medium">{t('footer.secure_delivery')}</span>
            <span className="text-xs text-gray-400 font-medium">{t('footer.quality_guaranteed')}</span>
            <span className="text-xs text-gray-400 font-medium">{t('footer.farm_fresh')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
