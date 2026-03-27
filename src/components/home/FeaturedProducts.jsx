import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { getActiveProducts } from '../../services/productService';
import { useTranslation } from 'react-i18next';

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Assuming we want 4 products max for the featured section
        const fetchedProducts = await getActiveProducts({ limitCount: 4 });
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50 rounded-3xl my-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('home.featured.title')}</h2>
          <p className="text-gray-500">{t('home.featured.subtitle')}</p>
        </div>
        <Link to="/shop" className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors">
          {t('home.featured.view_all')} <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl h-80 animate-pulse p-4 shadow-sm border border-gray-100 flex flex-col">
              <div className="bg-gray-200 w-full h-40 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 w-1/3 mb-2 rounded"></div>
              <div className="bg-gray-200 h-5 w-2/3 mb-4 rounded"></div>
              <div className="bg-gray-200 h-6 w-1/4 mt-auto rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-white rounded-xl border border-red-100">
          <p className="text-red-500">{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 mb-4">{t('home.featured.no_products')}</p>
          <Link to="/shop" className="btn-primary inline-flex">
            {t('home.featured.browse_all')}
          </Link>
        </div>
      )}

      <div className="mt-8 sm:hidden flex justify-center">
        <Link to="/shop" className="btn-secondary inline-flex items-center w-full justify-center">
          {t('home.featured.view_all')} <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
