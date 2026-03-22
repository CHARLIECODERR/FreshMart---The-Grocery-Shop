import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FixedSizeGrid as Grid } from 'react-window';
import { getActiveProducts } from '../../services/productService';
import { getActiveCategories } from '../../services/categoryService';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import useDebounce from '../../hooks/useDebounce';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnCount, setColumnCount] = useState(4);
  const [gridWidth, setGridWidth] = useState(window.innerWidth > 1280 ? 1280 : window.innerWidth - 64);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let cols = 1;
      if (width >= 1024) cols = 4;
      else if (width >= 768) cols = 2;
      setColumnCount(cols);
      setGridWidth(Math.min(1280, width - (width > 640 ? 64 : 32)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        setError("Failed to load products.");
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

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const product = filteredProducts[index];
    if (!product) return null;

    return (
      <div style={{ ...style, padding: '12px' }}>
        <ProductCard product={product} />
      </div>
    );
  }, [filteredProducts, columnCount]);

  const rowCount = Math.ceil(filteredProducts.length / columnCount);
  const columnWidth = gridWidth / columnCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-gray-500">Showing {filteredProducts.length} fresh products</p>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
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
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
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
        <div className="flex justify-center -mx-3">
          <Grid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={800} // Dynamic height or fixed
            rowCount={rowCount}
            rowHeight={500} // Approx height of ProductCard
            width={gridWidth}
            className="no-scrollbar"
          >
            {Cell}
          </Grid>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any products matching your current filters. Try adjusting your search term or category.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
