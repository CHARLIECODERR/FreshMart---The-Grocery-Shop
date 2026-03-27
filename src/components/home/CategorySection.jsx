import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { getActiveCategories } from '../../services/categoryService';
import { useTranslation } from 'react-i18next';

const CategorySection = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories(6);
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
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('home.category.loading')}</p>
      </div>
    );
  }

  // Category Translation Mapping
  const getLocalizedCategory = (catName) => {
    if (!catName) return "";
    const key = catName.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
    const translated = t(`categories.${key}`, { defaultValue: catName });
    return translated;
  };

  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Fresh Fruits', slug: 'fresh-fruits', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80', color: 'bg-orange-50', accent: 'text-orange-600' },
    { id: '2', name: 'Vegetables', slug: 'vegetables', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80', color: 'bg-green-50', accent: 'text-emerald-600' },
    { id: '3', name: 'Dairy & Eggs', slug: 'dairy-eggs', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80', color: 'bg-blue-50', accent: 'text-blue-600' },
    { id: '4', name: 'Meat & Poultry', slug: 'meat-poultry', imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80', color: 'bg-red-50', accent: 'text-rose-600' },
    { id: '5', name: 'Bakery', slug: 'bakery', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80', color: 'bg-amber-50', accent: 'text-amber-600' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3 block">{t('home.category.badge')}</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{t('home.category.title')}</h2>
        </div>
        <Link to="/categories" className="hidden sm:flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-widest group border-b-2 border-slate-900 pb-2 transition-all hover:gap-5">
          {t('home.category.view_all')} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 justify-center items-center">
        {displayCategories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link 
              to={`/category/${cat.slug}`}
              className="group block"
            >
              <div className={`relative w-full aspect-square rounded-[2rem] ${cat.color || 'bg-slate-50'} p-4 mb-6 transition-all duration-500 group-hover:rounded-[3rem] group-hover:shadow-2xl overflow-hidden`}>
                {cat.imageUrl ? (
                  <img 
                    src={cat.imageUrl} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />
                ) : (
                  <div className="w-full h-full bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white">
                    <span className="text-slate-300 font-black text-3xl uppercase">{cat.name.charAt(0)}</span>
                  </div>
                )}
                
                {/* Hover overlay toggle */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500" />
              </div>
              <h3 className={`font-black text-slate-900 text-center transition-all duration-300 group-hover:scale-105 ${cat.accent || ''}`}>
                {getLocalizedCategory(cat.name)}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 sm:hidden flex justify-center">
        <Link to="/categories" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
          {t('home.category.explore_all')} <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default CategorySection;
