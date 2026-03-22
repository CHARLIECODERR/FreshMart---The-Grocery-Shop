import React from 'react';
import { 
  User, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import StarRating from '../../common/StarRating';

const ProductInfo = ({ 
  product, 
  farmer, 
  quantity, 
  setQuantity, 
  addItem, 
  toggleWishlist, 
  isInWishlist 
}) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
          {product.category || product.categorySlug || 'Fresh'}
        </span>
        <div className="flex items-center gap-2">
          <StarRating rating={product.averageRating || 0} size={16} />
          <span className="text-gray-900 font-extrabold text-sm">
            {product.averageRating ? product.averageRating.toFixed(1) : "No ratings"}
          </span>
          <span className="text-gray-400 text-xs font-medium">({product.reviewCount || 0} reviews)</span>
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
        {product.name}
      </h1>

      {farmer && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <User size={14} className="text-primary-600" />
            <span className="font-semibold text-gray-700">Sold by {farmer.displayName}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
          <span className="text-emerald-600 font-bold">Verified Farmer</span>
        </div>
      )}
      
      <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-emerald-600 tracking-tight">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xl text-gray-300 line-through font-medium">₹{product.mrp}</span>
          )}
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">per {product.unit || 'piece'}</p>
      </div>

      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        {product.description || "Experience the authentic taste of farm-fresh produce..."}
      </p>

      <div className="flex flex-col sm:flex-row gap-6 mb-8">
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
          onClick={() => addItem(product, quantity)}
          disabled={isOutOfStock}
          className="flex-grow h-16 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
        >
          <ShoppingCart size={20} />
          {isOutOfStock ? "Out of Stock" : "Add to Harvest Bag"}
        </button>

        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all shrink-0 ${isInWishlist ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
        >
          <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
               <ShieldCheck size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Safety First</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase">Pesticide Free</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
               <Truck size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Cold Chain</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase">Farm to Door</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default React.memo(ProductInfo);
