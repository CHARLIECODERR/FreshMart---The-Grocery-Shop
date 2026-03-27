import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', icon: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', icon: '🇮🇳' },
  { code: 'mr', name: 'मराठी', icon: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', icon: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', icon: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', icon: '🇮🇳' }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 group"
      >
        <Languages size={18} className="text-slate-500 group-hover:text-emerald-600 transition-colors" />
        <span className="text-sm font-bold text-slate-700">{currentLanguage.name}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      i18n.language === lang.code
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-lg">{lang.icon}</span>
                    <span className="text-sm font-bold">{lang.name}</span>
                    {i18n.language === lang.code && (
                      <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
