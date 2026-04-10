import React from 'react';
import { 
  User, 
  Minus, 
  Plus, 
  ShoppingBag,
  Star,
  Heart, 
  ShieldCheck, 
  Truck,
  Share2
} from 'lucide-react';
import StarRating from '../../common/StarRating';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ProductInfo = ({ 
  product, 
  farmer, 
  quantity, 
  setQuantity, 
  addItem, 
  toggleWishlist, 
  isInWishlist 
}) => {
  const { t } = useTranslation();
  const isOutOfStock = product.stock === 0;

  // Assuming onAddToCart is the new name for addItem in the context of the button
  const onAddToCart = () => addItem(product, quantity);

  // Calculate discounted price if needed, based on the new price display
  const discountedPrice = product.price; // Assuming product.price is already the final price

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: t('product.share_text', { defaultValue: `Check out this ${product.name} on FreshMart!` }),
        url: url
      }).catch((err) => {
        if (err.name !== 'AbortError') copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success(t('product.share_success'));
    }).catch(() => {
      toast.error(t('common.error', { defaultValue: 'Failed to copy link' }));
    });
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
          {t(`categories.${(product.category || product.categorySlug || 'Fresh').toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`, { defaultValue: product.category || 'Fresh' })}
        </span>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={`${i < Math.floor(product.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="ml-2 text-sm font-bold text-gray-900">{product.averageRating ? product.averageRating.toFixed(1) : t('product_details.no_ratings')}</span>
          <span className="ml-2 text-sm text-gray-500">{t('product_details.reviews_count', { count: product.reviewCount || 0 })}</span>
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
        {product.name}
      </h1>

      {farmer && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <User size={14} className="text-primary-600" />
            <span className="font-semibold text-gray-700">
              {t('product_details.sold_by', { name: farmer.displayName || 'Local Farmer' })}
            </span>
          </div>
          <div className="flex items-center text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
            <ShieldCheck size={12} className="mr-1" />
            {t('product_details.verified_farmer')}
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-emerald-600 tracking-tight">₹{Math.floor(discountedPrice)}</span>
          {product.mrp > product.price && (
            <span className="text-xl text-gray-300 line-through font-medium">₹{product.mrp}</span>
          )}
          <span className="ml-3 text-lg text-gray-500 font-medium">{t('product_details.per_unit', { unit: product.unit || 'kg' })}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        {product.description || "Experience the authentic taste of farm-fresh produce..."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex items-center h-16 bg-gray-50 rounded-2xl border border-gray-100 p-2 shrink-0">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-xl text-gray-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all flex items-center justify-center font-bold"
          >
            <Minus size={20} />
          </button>
          <div className="w-16 text-center text-xl font-black text-gray-900">{quantity}</div>
          <button 
            onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
            className="w-12 h-12 rounded-xl text-gray-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all flex items-center justify-center font-bold"
          >
            <Plus size={20} />
          </button>
        </div>

        <button
          onClick={onAddToCart}
          disabled={isOutOfStock}
          className={`flex-grow h-16 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-bold transition-all transform active:scale-95 shadow-lg shadow-primary-200 ${
            isOutOfStock 
            ? 'bg-gray-400 cursor-not-allowed shadow-none' 
            : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <ShoppingBag size={20} />
          {isOutOfStock ? t('product.sold_out') : t('product_details.add_to_bag')}
        </button>

        <div className="flex gap-2">
          <button 
            onClick={() => toggleWishlist(product.id)}
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all shrink-0 ${isInWishlist ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
            title={isInWishlist ? t('product.wishlist_remove') : t('product.wishlist_add')}
          >
            <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
          </button>

          <button 
            onClick={handleShare}
            className="w-16 h-16 rounded-2xl border flex items-center justify-center transition-all shrink-0 bg-white border-gray-100 text-gray-400 hover:border-emerald-500 hover:text-emerald-500"
            title={t('product.share')}
          >
            <Share2 size={24} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
         <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{t('product_details.safety_title')}</h4>
            <p className="text-xs text-gray-500">{t('product_details.safety_desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{t('product_details.cold_chain_title')}</h4>
            <p className="text-xs text-gray-500">{t('product_details.cold_chain_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductInfo);
