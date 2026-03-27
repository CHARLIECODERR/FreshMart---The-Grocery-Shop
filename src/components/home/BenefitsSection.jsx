import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Leaf, ShieldCheck, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BenefitsSection = () => {
  const { t } = useTranslation();
  const benefits = [
    {
      id: 1,
      icon: <Truck size={32} />,
      title: t('home.benefits.swift.title'),
      description: t('home.benefits.swift.desc'),
      color: "from-blue-500/10 to-blue-500/5 text-blue-600",
      accent: "bg-blue-600"
    },
    {
      id: 2,
      icon: <Leaf size={32} />,
      title: t('home.benefits.organic.title'),
      description: t('home.benefits.organic.desc'),
      color: "from-emerald-500/10 to-emerald-500/5 text-emerald-600",
      accent: "bg-emerald-600"
    },
    {
      id: 3,
      icon: <ShieldCheck size={32} />,
      title: t('home.benefits.trust.title'),
      description: t('home.benefits.trust.desc'),
      color: "from-amber-500/10 to-amber-500/5 text-amber-600",
      accent: "bg-amber-600"
    },
    {
      id: 4,
      icon: <RefreshCw size={32} />,
      title: t('home.benefits.returns.title'),
      description: t('home.benefits.returns.desc'),
      color: "from-rose-500/10 to-rose-500/5 text-rose-600",
      accent: "bg-rose-600"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-50 mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {benefits.map((benefit, idx) => (
          <motion.div 
            key={benefit.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative flex flex-col items-center text-center p-10 rounded-[2.5rem] bg-white border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-100 hover:-translate-y-2 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl rounded-full ${benefit.accent}`} />
            
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 bg-gradient-to-br ${benefit.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
              {benefit.icon}
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{benefit.title}</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed px-2">{benefit.description}</p>
            
            {/* Progress indicator */}
            <div className="mt-8 w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: '100%' }}
                 transition={{ duration: 1, delay: idx * 0.2 }}
                 className={`h-full ${benefit.accent}`} 
               />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
