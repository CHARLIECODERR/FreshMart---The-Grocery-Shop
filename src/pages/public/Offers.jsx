import React from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Offers = () => {
  return (
    <div className="bg-red-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-6">
            <Tag size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Special Offers</h1>
          <p className="text-lg text-gray-600">
            Grab the freshest deals on your favorite farm produce before they run out!
          </p>
        </div>

        {/* Big Promo Card */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-xl border border-red-100/50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 mix-blend-multiply opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=2000" 
            alt="Fruits background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative p-8 md:p-16 flex flex-col items-start justify-center text-white">
            <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-bold tracking-wider uppercase mb-6">
              Weekend Special
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-xl">
              Get 30% Off All Organic Citrus Fruits
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-lg">
              Freshly picked oranges, lemons, and grapefruits. Valid until Sunday midnight.
            </p>
            <Link to="/shop" className="bg-white text-red-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:-translate-y-1 flex items-center justify-center">
              Claim Offer <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Small Promo Cards shell */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8 border-l-4 border-l-blue-500 flex flex-col justify-center bg-white hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-gray-500 mb-6">Use code <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 font-bold">FREEDEL</span> on orders over ₹500.</p>
            <div className="mt-auto">
              <Link to="/shop" className="text-blue-600 font-medium hover:underline inline-flex items-center">
                Start Shopping <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="card p-8 border-l-4 border-l-green-500 flex flex-col justify-center bg-white hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Buy 1 Get 1 Free</h3>
            <p className="text-gray-500 mb-6">On select seasonal vegetables. Limited time only.</p>
            <div className="mt-auto">
              <Link to="/category/vegetables" className="text-green-600 font-medium hover:underline inline-flex items-center">
                View Vegetables <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Offers;
