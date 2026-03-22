import React from 'react';

const ProductGallery = ({ product }) => {
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
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl font-bold">Out of Stock</span>
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
