import React from 'react';
import { useTranslation } from 'react-i18next';

const ProductGallery = ({ product }) => {
  const { t } = useTranslation();
  const imageUrl = product.imageUrl || product.image || product.prodImage;
  const isOutOfStock = product.stock === 0;
  
  // Calculate discount percentage
  let discountBadge = product.discount;
  if (!discountBadge && product.mrp > product.price) {
    const percent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    discountBadge = `${percent}% OFF`;
  }

  return (
    <div className="w-full lg:w-1/2">
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-2">
              <span className="text-gray-400 font-medium">{t('product.no_image')}</span>
            </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                {t('product.sold_out')}
              </span>
          </div>
        )}
        {discountBadge && (
          <div className="absolute top-6 left-6">
            <span className="bg-emerald-500 text-white px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200">
              {discountBadge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductGallery);
