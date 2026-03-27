import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative bg-emerald-50 overflow-hidden rounded-[2.5rem] mx-4 sm:mx-6 lg:mx-8 my-6 px-6 py-16 lg:py-24 lg:px-12 flex flex-col lg:flex-row items-center gap-12 border border-emerald-100 shadow-sm">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/50 mix-blend-multiply blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-yellow-200/50 mix-blend-multiply blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      {/* Left Content */}
      <div className="lg:w-1/2 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-800 text-sm font-bold mb-8"
        >
          <Sparkles size={16} className="text-yellow-500" />
          <span>{t('home.hero.badge')}</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-[1.1]"
        >
          {t('home.hero.title_1')} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">{t('home.hero.title_2')}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
        >
          {t('home.hero.subtitle')}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link 
            to="/shop" 
            className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center group"
          >
            {t('home.hero.shop_now')}
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/categories" 
            className="bg-white text-emerald-900 hover:bg-emerald-50 border-2 border-emerald-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center"
          >
            {t('home.hero.explore')}
          </Link>
        </motion.div>

        {/* Mini Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-6 mt-12 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-emerald-100/50"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" />
            ))}
          </div>
          <div>
            <div className="flex items-center text-yellow-500 mb-1">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-xs font-bold text-gray-800">{t('home.hero.happy_families')}</p>
          </div>
        </motion.div>
      </div>

      {/* Right Content - Floating UI Gallery */}
      <div className="lg:w-1/2 relative z-10 w-full h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-square">
          {/* Main Center Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute inset-4 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white z-20"
          >
            <img 
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=100&w=1200" 
              alt="Fresh organic vegetables" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
          </motion.div>

          {/* Floating Card 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-12 z-30 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
          >
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{t('home.hero.freshness')}</p>
              <p className="text-sm font-bold text-gray-900">{t('home.hero.guaranteed')}</p>
            </div>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 bottom-24 z-30 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 pr-5"
          >
            <img src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=150&q=100" alt="Tomato" className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-bold text-gray-900">{t('home.hero.tomatoes')}</p>
              <p className="text-xs text-emerald-600 font-bold mt-0.5">₹40 / kg</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
