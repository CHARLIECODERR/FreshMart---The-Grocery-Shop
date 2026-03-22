import React from 'react';

const Skeleton = ({ className, width, height, rounded = 'rounded-xl' }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="card bg-white p-4 border border-gray-100 rounded-2xl flex flex-col h-full">
    <Skeleton className="aspect-square mb-4" />
    <div className="space-y-3 flex-1">
      <div className="flex justify-between">
        <Skeleton width="40px" height="12px" />
        <Skeleton width="30px" height="16px" rounded="rounded-lg" />
      </div>
      <Skeleton width="60%" height="16px" />
      <Skeleton width="100%" height="20px" />
      <div className="flex items-end gap-2 mt-auto pt-4">
        <Skeleton width="50px" height="24px" />
        <Skeleton width="40px" height="16px" />
      </div>
      <Skeleton height="40px" rounded="rounded-xl" className="mt-4" />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
    <div className="flex gap-2 mb-8">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="100px" height="16px" />
    </div>
    <div className="bg-white rounded-[2rem] p-6 lg:p-10 border border-gray-100 mb-12 flex flex-col lg:flex-row gap-12">
      <Skeleton className="w-full lg:w-1/2 aspect-square rounded-[2rem]" />
      <div className="w-full lg:w-1/2 space-y-6">
        <Skeleton width="80px" height="24px" rounded="rounded-full" />
        <Skeleton width="70%" height="40px" />
        <Skeleton width="40%" height="24px" />
        <Skeleton width="100%" height="100px" />
        <div className="flex gap-6 h-16">
          <Skeleton width="120px" height="100%" />
          <Skeleton className="flex-grow" height="100%" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
