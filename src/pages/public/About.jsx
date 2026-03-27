import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Sprout, HeartHandshake, ArrowRight, Award, Leaf, X, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [showJourney, setShowJourney] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const journeySteps = [
    {
      title: t('about.journey.steps.sowing.title'),
      desc: t('about.journey.steps.sowing.desc'),
      image: "/images/journey_1.png"
    },
    {
      title: t('about.journey.steps.harvest.title'),
      desc: t('about.journey.steps.harvest.desc'),
      image: "/images/journey_2.png"
    },
    {
      title: t('about.journey.steps.curation.title'),
      desc: t('about.journey.steps.curation.desc'),
      image: "/images/journey_3.png"
    },
    {
      title: t('about.journey.steps.arrival.title'),
      desc: t('about.journey.steps.arrival.desc'),
      image: "/images/journey_4.png"
    }
  ];

  const nextStep = () => setCurrentStep((prev) => (prev + 1) % journeySteps.length);
  const prevStep = () => setCurrentStep((prev) => (prev - 1 + journeySteps.length) % journeySteps.length);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Journey Modal (Photo Story) */}
      <AnimatePresence>
        {showJourney && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
          >
            <div 
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setShowJourney(false)}
            ></div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-6xl h-[80vh] bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/20"
            >
              <button 
                onClick={() => setShowJourney(false)}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/10 hover:bg-black/20 text-gray-900 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image Side */}
              <div className="lg:w-3/5 h-2/3 lg:h-full relative overflow-hidden bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentStep}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    src={journeySteps[currentStep].image}
                    alt={journeySteps[currentStep].title}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                <div className="absolute inset-x-0 bottom-10 flex justify-center gap-4 z-10 px-6">
                   <button onClick={prevStep} className="w-14 h-14 rounded-2xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all">
                      <ArrowRight size={24} className="rotate-180" />
                   </button>
                   <button onClick={nextStep} className="w-14 h-14 rounded-2xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all">
                      <ArrowRight size={24} />
                   </button>
                </div>
              </div>

              {/* Text Side */}
              <div className="lg:w-2/5 p-8 lg:p-16 flex flex-col justify-center bg-white relative">
                 <div className="mb-10">
                    <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                      {t('about.journey.step', { current: currentStep + 1, total: journeySteps.length })}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                         <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">{journeySteps[currentStep].title}</h2>
                         <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            {journeySteps[currentStep].desc}
                         </p>
                      </motion.div>
                    </AnimatePresence>
                 </div>

                 {/* Progress Indicators */}
                 <div className="flex gap-2 mb-12">
                    {journeySteps.map((_, i) => (
                       <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-12 bg-emerald-500' : 'w-4 bg-gray-100'}`}></div>
                    ))}
                 </div>

                 <button 
                  onClick={currentStep === journeySteps.length - 1 ? () => setShowJourney(false) : nextStep}
                  className="btn-primary w-full py-5 rounded-[2rem] text-sm"
                 >
                   {currentStep === journeySteps.length - 1 ? t('about.journey.start') : t('about.journey.next')}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center py-24 overflow-hidden">
        <div className="absolute inset-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="/images/about_hero.png" 
            alt={t('about.hero.badge')} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-white"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-emerald-500/30 mb-6">
              {t('about.hero.badge')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              {t('about.hero.title_1')} <br/> <span className="text-emerald-400">{t('about.hero.title_2')}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed font-medium mb-10">
              {t('about.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link to="/shop" className="btn-primary px-10 py-4 h-auto text-sm">{t('about.hero.cta')}</Link>
               <button 
                  onClick={() => setShowJourney(true)}
                  className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400 transition-colors group"
               >
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                     <Play size={16} fill="currentColor" />
                  </div>
                  {t('about.hero.journey_btn')}
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-100 p-8 md:p-12 border border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
               <p className="text-4xl font-black text-gray-900 tracking-tighter">500+</p>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('about.stats.farmers')}</p>
            </div>
            <div className="text-center space-y-2">
               <p className="text-4xl font-black text-gray-900 tracking-tighter">10k+</p>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('about.stats.families')}</p>
            </div>
            <div className="text-center space-y-2">
               <p className="text-4xl font-black text-gray-900 tracking-tighter">100%</p>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('about.stats.organic')}</p>
            </div>
            <div className="text-center space-y-2">
               <p className="text-4xl font-black text-gray-900 tracking-tighter">24h</p>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('about.stats.delivery')}</p>
            </div>
         </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">{t('about.story.badge')}</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {t('about.story.title', { 
                  defaultValue: "Freshness was being traditionally lost.",
                  interpolation: { escapeValue: false }
                })}
              </h2>
            </motion.div>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed font-medium">
              {t('about.story.desc_1')}
            </motion.p>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed font-medium">
              {t('about.story.desc_2')}
            </motion.p>
            <motion.div variants={itemVariants} className="pt-6">
               <div className="flex items-center gap-4 p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                     <Award className="text-emerald-600" size={28} />
                  </div>
                  <div>
                     <p className="text-sm font-black text-gray-900">{t('about.story.award_title')}</p>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t('about.story.award_subtitle')}</p>
                  </div>
               </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white">
              <img 
                src="/images/about_story.png" 
                alt={t('about.story.badge')} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50/50 py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">{t('about.values.badge')}</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">{t('about.values.title')}</h2>
            <p className="text-gray-500 text-lg font-medium">{t('about.values.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sprout, key: 'organic', bg: 'bg-emerald-50', color: 'text-emerald-600' },
              { icon: HeartHandshake, key: 'farmer', bg: 'bg-blue-50', color: 'text-blue-600' },
              { icon: ShieldCheck, key: 'guaranteed', bg: 'bg-orange-50', color: 'text-orange-600' },
              { icon: Truck, key: 'delivery', bg: 'bg-slate-50', color: 'text-slate-600' }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-50 group"
              >
                <div className={`w-16 h-16 ${value.bg} ${value.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{t(`about.values.${value.key}.title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{t(`about.values.${value.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
