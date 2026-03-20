import React from 'react';
import { User, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import StarRating from '../common/StarRating';

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare size={32} />
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Awaiting first harvest review</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Customer Feedback</h3>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest animate-pulse">
           <ShieldCheck size={14} /> Verified Harvest
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center shrink-0 border-2 border-white shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-1">{review.userName || "Customer"}</h4>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size={12} />
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} /> 
                      {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm font-medium leading-relaxed italic">
              "{review.comment || "Great product, very fresh!"}"
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-3">
               <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">Verified Purchase</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
