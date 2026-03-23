import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveCategories } from '../../services/categoryService';
import { Loader2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  // Fallback UI
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Fresh Fruits', slug: 'fresh-fruits', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80', description: 'Handpicked seasonal fruits directly from orchards.' },
    { id: '2', name: 'Vegetables', slug: 'vegetables', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80', description: 'Daily fresh vegetables from local farms.' },
    { id: '3', name: 'Dairy & Eggs', slug: 'dairy-eggs', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80', description: 'Fresh milk, cheese, and farm-raised eggs.' },
    { id: '4', name: 'Meat & Poultry', slug: 'meat-poultry', imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80', description: 'Premium cuts of meat and fresh poultry.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Browse our wide selection of fresh produce and groceries. We partner with local farmers to bring you the best quality everyday.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayCategories.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/category/${cat.slug}`}
            className="group card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
              {cat.imageUrl ? (
                <img 
                  src={cat.imageUrl} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-50">
                  <span className="text-4xl font-bold text-primary-200">{cat.name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {cat.description || `Explore our fresh selection of ${cat.name.toLowerCase()}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
