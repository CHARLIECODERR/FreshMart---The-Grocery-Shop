import React, { useState, useEffect } from 'react';
import { Tag, ArrowRight, Copy, Loader2, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getActiveCoupons } from '../../services/couponService';
import toast from 'react-hot-toast';

const Offers = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await getActiveCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied!`, {
      icon: '🎁',
      style: {
        borderRadius: '1rem',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        <div className="text-center max-w-2xl mx-auto mb-20 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-emerald-100 text-emerald-600 mb-8 border-4 border-white shadow-xl rotate-3">
            <Tag size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Special Offers</h1>
          <p className="text-xl text-slate-500 font-medium">
            Grab the freshest deals on your favorite farm produce. Use these codes at checkout!
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <p className="font-black uppercase tracking-widest text-xs">Loading freshest deals...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Tag size={48} />
             </div>
             <h3 className="text-2xl font-black text-slate-900">No active offers right now</h3>
             <p className="text-slate-400 font-medium mt-2">Check back soon for seasonal discounts!</p>
             <Link to="/shop" className="inline-flex items-center mt-8 text-emerald-600 font-black uppercase tracking-widest text-xs hover:gap-2 transition-all">
                Shop all products <ArrowRight size={16} />
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="group relative bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <PartyPopper size={120} />
                </div>
                
                <div className="p-10 flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      Active Offer
                    </span>
                    {coupon.expiry && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Expires: {new Date(coupon.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">
                    {coupon.discount}<span className="text-2xl ml-1 text-emerald-500">%</span>
                  </h3>
                  <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
                    {coupon.description || `Get ${coupon.discount}% off on your next purchase across all farm categories.`}
                  </p>

                  <div className="relative group/btn mt-auto">
                    <button 
                      onClick={() => copyToClipboard(coupon.code)}
                      className="w-full bg-slate-900 text-white rounded-[1.5rem] p-5 flex items-center justify-between group-active:scale-95 transition-all shadow-xl shadow-slate-200"
                    >
                      <div className="flex flex-col items-start translate-x-2">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Coupon Code</span>
                        <span className="text-xl font-black tracking-tighter">{coupon.code}</span>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover/btn:bg-white/20 transition-all">
                         <Copy size={20} />
                      </div>
                    </button>
                    {/* Dashed line effect */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-50 -translate-y-1/2 border border-slate-100 hidden lg:block" />
                    <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-50 -translate-y-1/2 border border-slate-100 hidden lg:block" />
                  </div>
                </div>

                <Link to="/shop" className="bg-slate-50 p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  Shop with this deal
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
           <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mb-4">Need help?</p>
           <div className="flex justify-center gap-8">
              <Link to="/contact" className="text-slate-900 font-black hover:text-emerald-500 transition-colors">Contact Support</Link>
              <Link to="/about" className="text-slate-900 font-black hover:text-emerald-500 transition-colors">How it works</Link>
           </div>
        </div>
        
      </div>
    </div>
  );
};

export default Offers;
