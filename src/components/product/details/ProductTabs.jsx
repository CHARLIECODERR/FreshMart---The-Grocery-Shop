import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  ShieldCheck, 
  User, 
  Phone, 
  MessageCircle, 
  Loader2 
} from 'lucide-react';
import StarRating from '../../common/StarRating';
import ReviewList from '../../review/ReviewList';

const ProductTabs = ({ 
  activeTab, 
  setActiveTab, 
  product, 
  farmer, 
  reviews, 
  reviewsLoading 
}) => {
  return (
    <div className="mb-12">
      <div className="flex border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
        {['details', 'farmer', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-8 text-xs font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${
              activeTab === tab ? 'text-primary-600' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab === 'details' ? 'Harvest Details' : tab === 'farmer' ? 'About Farmer' : `Reviews (${reviews.length})`}
            {activeTab === tab && (
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
              <h3 className="text-xl font-black text-gray-900 border-l-4 border-emerald-500 pl-4 mb-6">Produce Info</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {product.description || "Our harvest is nurtured with organic care, ensuring every bite is packed with nature's pure essence."}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</span>
                    <span className="text-sm font-bold text-gray-900">{product.category || 'Organic'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Weight</span>
                    <span className="text-sm font-bold text-gray-900">{product.unit || '1 Unit'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shelf Life</span>
                    <span className="text-sm font-bold text-gray-900">3-5 Days</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 flex flex-col justify-center gap-6">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                       <RefreshCw className="text-emerald-500" size={24} />
                    </div>
                    <div>
                       <p className="font-black text-gray-900 text-xs uppercase tracking-widest mb-1">Sustainable Growth</p>
                       <p className="text-[10px] text-gray-500 font-medium">100% Organic methods focused on long-term soil health.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                       <ShieldCheck className="text-blue-500" size={24} />
                    </div>
                    <div>
                       <p className="font-black text-gray-900 text-xs uppercase tracking-widest mb-1">Quality Guaranteed</p>
                       <p className="text-[10px] text-gray-500 font-medium">Rigorous quality checks before every dispatch.</p>
                    </div>
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
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cataloging Harvest Feedback...</p>
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
