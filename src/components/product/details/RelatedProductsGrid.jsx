import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';
import { useTranslation } from 'react-i18next';

const RelatedProductsGrid = ({ products = [] }) => {
  const { t } = useTranslation();
  if (products.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3 inline-block">
            {t('product_details.related_badge')}
          </span>
          <h2 className="text-3xl font-bold text-gray-900">{t('product_details.related_title')}</h2>
        </div>
        <Link to="/shop" className="text-primary-600 font-bold hover:text-primary-700 transition-colors flex items-center group">
          {t('product_details.related_link')}
          <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(RelatedProductsGrid);
