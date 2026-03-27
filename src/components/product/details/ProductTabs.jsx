import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  ShieldCheck,
  User,
  Phone,
  MessageCircle,
  Loader2,
  Star,
  Check,
  Globe,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StarRating from '../../common/StarRating';
import ReviewList from '../../review/ReviewList';

const ProductTabs = ({
  product,
  farmer,
  reviews = [],
  reviewsLoading
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: t('product_details.tab_details') },
    { id: 'farmer', label: t('product_details.tab_farmer') },
    { id: 'reviews', label: t('product_details.tab_reviews', { count: reviews.length }) },
  ];

  return (
    <div className="mb-12">
      <div className="flex border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setActiveTab(tabItem.id)}
            className={`pb-4 px-8 text-xs font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${
              activeTab === tabItem.id ? 'text-primary-600' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            {tabItem.label}
            {activeTab === tabItem.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="mr-3 text-primary-600" size={24} />
                {t('product_details.produce_info')}
              </h3>

              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed text-lg italic bg-white p-6 rounded-2xl border-l-4 border-primary-500 shadow-sm">
                  "{product.description || t("product_details.default_description")}"
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">{t('product_details.field_category')}</span>
                    <span className="text-gray-900 font-bold capitalize">
                      {t(`categories.${(product.category || 'Organic').toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`, { defaultValue: product.category || 'Organic' })}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">{t('product_details.field_unit')}</span>
                    <span className="text-gray-900 font-bold">{product.unitValue || '500g'}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">{t('product_details.field_shelf_life')}</span>
                    <span className="text-gray-900 font-bold">{t('product_details.shelf_life_val')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="card p-6 border-primary-100 hover:border-primary-300 transition-colors">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                  <Check size={24} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{t('product_details.stats_sustainable')}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('product_details.stats_sustainable_desc')}
                </p>
              </div>

              <div className="card p-6 border-blue-100 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <Star size={24} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{t('product_details.stats_quality')}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('product_details.stats_quality_desc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'farmer' && farmer && (
          <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-48 h-48 rounded-[3rem] bg-gray-50 overflow-hidden shrink-0 border-4 border-white shadow-xl relative group">
              {farmer.photoURL ? (
                <img src={farmer.photoURL} alt={farmer.displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600 text-4xl font-bold font-black">
                  {farmer.displayName?.charAt(0) || 'F'}
                </div>
              )}
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <h3 className="text-3xl font-black text-gray-900 leading-none">{farmer.displayName}</h3>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <StarRating rating={farmer.averageRating || 0} size={14} />
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                     {farmer.averageRating ? farmer.averageRating.toFixed(1) : '5.0'} ★ Merchant
                  </span>
                </div>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed mb-8 max-w-2xl">
                {farmer.description || "Dedicated to preserving traditional agricultural methods while embracing modern sustainable practices."}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                {farmer.phoneNumber && (
                  <a href={`tel:${farmer.phoneNumber}`} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                    <Phone size={16} /> Contact Farmer
                  </a>
                )}
                <button className="px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center gap-3">
                  <MessageCircle size={16} /> Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto">
            {reviewsLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="animate-spin text-primary-500 mx-auto mb-4" size={32} />
                <p className="text-gray-500 font-medium">{t('product_details.loading_feedback')}</p>
              </div>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductTabs);
