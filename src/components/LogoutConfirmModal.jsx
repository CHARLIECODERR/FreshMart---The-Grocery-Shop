import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mx-auto mb-6">
              <LogOut size={28} className="text-red-500" />
            </div>

            {/* Text */}
            <h2 className="text-xl font-black text-slate-900 text-center mb-2">
              {t('farmer.logout_modal.title')}
            </h2>
            <p className="text-sm text-slate-500 font-medium text-center mb-8">
              {t('farmer.logout_modal.desc')}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                {t('farmer.logout_modal.stay')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-100"
              >
                {t('farmer.logout_modal.confirm')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
