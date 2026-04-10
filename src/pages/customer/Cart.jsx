import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getCartTotal, getItemCount } = useCartStore();
  
  const total = getCartTotal();
  const count = getItemCount();
  const shipping = total > 500 ? 0 : 40;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our fresh products and find something you'll love!
        </p>
        <Link to="/shop" className="btn-primary inline-flex items-center">
          <ArrowLeft size={18} className="mr-2" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
        <span className="text-gray-500 font-medium">{count} items</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <div className="col-span-3">Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Price</div>
              <div className="text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
                  {/* Product Info */}
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                      <img 
                        src={item.imageUrl || item.image || item.prodImage || item.thumbnail} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <Link to={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">{item.category} • {item.unit}</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1 hover:text-red-600"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex justify-center flex-col items-center gap-1">
                    <div className="flex items-center bg-gray-100 rounded-lg h-9 w-28 overflow-hidden border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex-1 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex-1 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex-1 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {item.stock < 10 && (
                      <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Only {item.stock} left</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="hidden md:block text-center font-bold text-gray-900">
                    ₹{item.price}
                  </div>

                  {/* total */}
                  <div className="text-right font-black text-emerald-600 text-lg">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/shop" className="inline-flex items-center text-emerald-600 font-bold mt-8 hover:text-emerald-700">
            <ArrowLeft size={18} className="mr-2" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-[380px]">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'text-gray-900'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  Add <span className="font-bold text-emerald-600">₹{500 - total}</span> more to get <span className="font-bold">FREE Delivery</span>!
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Grand Total</p>
                  <p className="text-4xl font-black text-gray-900 mt-1">₹{grandTotal}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center group active:scale-[0.98]"
            >
              Proceed to Checkout <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-6 font-medium">
              Secure checkout powered by FreshMart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
