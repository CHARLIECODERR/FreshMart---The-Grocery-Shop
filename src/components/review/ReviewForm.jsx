import React, { useState } from 'react';
import { X, Star, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from '../common/StarRating';
import { addReview } from '../../services/reviewService';
import toast from 'react-hot-toast';

const ReviewForm = ({ isOpen, onClose, product, userId, userName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      await addReview({
        productId: product.id,
        farmerId: product.farmerId,
        userId,
        userName,
        rating,
        comment,
      });
      toast.success("Review submitted! Thank you for your feedback.");
      onClose();
    } catch (error) {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2.5rem] p-8 sm:p-12 max-w-lg w-full relative z-10 shadow-2xl border border-slate-100"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner">
              <Star size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Rate Your Harvest</h3>
            <p className="text-gray-500 font-medium">How was the quality of {product.name}?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Overall Satisfaction</p>
              <StarRating 
                rating={rating} 
                onRatingChange={setRating} 
                size={36} 
                interactive 
                className="gap-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={14} className="text-emerald-500" /> Share your experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="The tomatoes were perfectly ripe and sweet! Delivered fresh..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-gray-300 min-h-[120px]"
              />
            </div>

            <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
               <AlertCircle size={18} className="text-blue-500 shrink-0" />
               <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                  Your feedback helps farmers maintain harvest quality and informs other customers in the ecosystem.
               </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {submitting ? <Loader2 size={18} className="animate-spin text-emerald-400" /> : "Broadcast Review"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewForm;
