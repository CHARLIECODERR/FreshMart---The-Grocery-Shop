import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';

const RelatedProductsGrid = ({ products, loading }) => {
  if (!loading && products.length === 0) return null;

  return (
    <div className="mt-20 pt-20 border-t border-gray-100 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-3">Harvest Recommendations</p>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Wait, Check These Too!</h2>
        </div>
        <Link to="/shop" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors">
          Explore Full Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(RelatedProductsGrid);
