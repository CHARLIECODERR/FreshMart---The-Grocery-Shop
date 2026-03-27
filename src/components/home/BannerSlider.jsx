import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getActiveBanners } from '../../services/bannerService';

const BannerSlider = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to load banners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="mx-4 sm:mx-6 lg:mx-8 my-10 h-64 md:h-80 lg:h-96 rounded-3xl bg-gray-100 flex items-center justify-center border border-gray-200">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  if (banners.length === 0) return null; // Or show a fallback UI

  return (
    <section className="relative mx-4 sm:mx-6 lg:mx-8 my-10 group overflow-hidden rounded-3xl bg-gray-900 h-64 md:h-80 lg:h-96 shadow-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img 
            src={banners[currentIndex].imageUrl || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=100&w=2000"} 
            alt={banners[currentIndex].title || t('home.hero.tomatoes')} 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {banners[currentIndex].title || t('home.hero.guaranteed')}
            </h2>
            {banners[currentIndex].subtitle && (
              <p className="text-lg text-white/90 mb-6 max-w-xl">
                {banners[currentIndex].subtitle}
              </p>
            )}
            {banners[currentIndex].link && (
              <div>
                <Link to={banners[currentIndex].link} className="btn-primary inline-flex text-sm md:text-base px-6 py-2.5">
                  {t('home.hero.shop_now')}
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-primary-500' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default BannerSlider;
