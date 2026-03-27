import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Filter, LayoutGrid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useDebounce from '../../hooks/useDebounce';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { getActiveProducts } from '../../services/productService';
import { getActiveCategories } from '../../services/categoryService';

const Shop = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getActiveProducts(),
          getActiveCategories()
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (err) {
        setError(t('shop.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.categorySlug === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('shop.title')}</h1>
          <p className="text-gray-500">{t('shop.showing', { count: filteredProducts.length })}</p>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('shop.search_placeholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white cursor-pointer"
          >
            <option value="all">{t('shop.all_categories')}</option>
            {categories.map(cat => {
              const catKey = cat.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
              return (
                <option key={cat.id} value={cat.slug}>{t(`categories.${catKey}`, { defaultValue: cat.name })}</option>
              );
            })}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 my-10">
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('shop.no_results_title')}</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {t('shop.no_results_desc')}
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="btn-primary"
          >
            {t('shop.clear_filters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
