import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveCategories } from '../../services/categoryService';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Categories = () => {
  const { t } = useTranslation();
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
    { id: '1', name: 'Fresh Fruits', slug: 'fruits', imageUrl: '/images/products/f_f.png', description: 'Handpicked seasonal fruits directly from orchards.' },
    { id: '2', name: 'Vegetables', slug: 'vegetables', imageUrl: '/images/products/tomato.png', description: 'Daily fresh vegetables from local farms.' },
    { id: '3', name: 'Dairy & Eggs', slug: 'dairy-eggs', imageUrl: '/images/products/milk.jpg', description: 'Fresh milk, cheese, and farm-raised eggs.' },
    { id: '4', name: 'Organic Products', slug: 'organic', imageUrl: '/images/products/palak.jpg', description: 'Pure organic produce for a healthy lifestyle.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('categories_page.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {t('categories_page.subtitle')}
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
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-50">
                  <span className="text-4xl font-bold text-primary-200">{cat.name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                  {t(`categories.${cat.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`, { defaultValue: cat.name })}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {cat.description || t('categories_page.fallback_desc', { name: t(`categories.${cat.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`, { defaultValue: cat.name }) })}
                </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
