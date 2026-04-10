import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Share2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import StarRating from '../common/StarRating';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ProductCard = memo(({ product }) => {
  const { t } = useTranslation();
  const { id, name, price, originalPrice, mrp, category, stock, unit, discount } = product;
  const imageUrl = product.imageUrl || product.image || product.prodImage || product.thumbnail;
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));

  const displayOriginalPrice = originalPrice || mrp;

  // Calculate discount percentage if not provided
  let discountBadge = discount;
  if (!discountBadge && displayOriginalPrice > price) {
    const percent = Math.round(((displayOriginalPrice - price) / displayOriginalPrice) * 100);
    discountBadge = `${percent}% ${t('home.hero.guaranteed').includes('%') ? '' : 'OFF'}`; // Simplified, better yet, just use localized "OFF" if needed
    // Actually, let's just make it simpler
    discountBadge = `${percent}%`;
  }

  // Category Translation Mapping
  const getLocalizedCategory = (catName) => {
    if (!catName) return "";
    const key = catName.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
    const translated = t(`categories.${key}`, { defaultValue: catName });
    return translated;
  };

  const isOutOfStock = stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/product/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: t('product.share_text', { defaultValue: `Check out this ${name} on FreshMart!` }),
        url: url
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          copyToClipboard(url);
        }
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
    <div className="card bg-white p-4 group flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative w-full border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-emerald-100">
      {/* Image & Quick Actions */}
      <div className="relative aspect-square rounded-xl bg-gray-50 mb-4 overflow-hidden flex items-center justify-center">
        <Link 
          to={`/product/${id}`}
          className="w-full h-full block"
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="text-gray-400">{t('product.no_image')}</div>
          )}
        </Link>

        {/* Action icons - Now OUTSIDE the main Link */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full shadow flex items-center justify-center transition-colors ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'}`} 
            title={isInWishlist ? t('product.wishlist_remove') : t('product.wishlist_add')}
          >
            <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
          </button>
          <Link to={`/product/${id}`} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors" title={t('product.quick_view')}>
            <Eye size={16} />
          </Link>
          <button 
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-colors"
            title={t('product.share')}
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountBadge && !isOutOfStock && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-200 border border-emerald-500 animate-in fade-in zoom-in duration-300">
              {discountBadge}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest opacity-90">
              {t('product.sold_out')}
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{getLocalizedCategory(category)}</span>
          {unit && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter shadow-sm border border-emerald-100">{unit}</span>}
        </div>
        
        {/* Rating display */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={product.averageRating || 0} size={12} />
          {product.reviewCount > 0 && (
            <span className="text-[10px] text-slate-400 font-bold">({product.reviewCount})</span>
          )}
        </div>
        
        <Link to={`/product/${id}`} className="font-bold text-slate-900 mb-3 line-clamp-2 hover:text-emerald-600 transition-colors flex-1 text-sm sm:text-base leading-tight tracking-tight">
          {name}
        </Link>
        
        <div className="flex items-end gap-2 mb-5 mt-auto">
          <div className="flex flex-col">
            {displayOriginalPrice > price && (
              <span className="text-[10px] text-slate-400 line-through font-bold mb-0.5 italic">
                ₹{displayOriginalPrice}
              </span>
            )}
            <span className="text-xl font-black text-slate-900 leading-none">
              ₹{price}
            </span>
          </div>
          {displayOriginalPrice > price && (
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mb-0.5">
              {t('product.save')} ₹{Math.round(displayOriginalPrice - price)}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10 active:scale-95'}`}
          disabled={isOutOfStock}
        >
          <ShoppingCart size={16} className="mr-2" />
          {isOutOfStock ? t('product.sold_out') : t('product.add_to_cart')}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
