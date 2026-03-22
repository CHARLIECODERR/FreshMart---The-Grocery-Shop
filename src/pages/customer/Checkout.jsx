import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuth } from '../../context/AuthContext';
import { getUserAddresses, addAddress } from '../../services/addressService';
import { placeOrder } from '../../services/orderService';
import { validateCoupon } from '../../services/couponService';
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  Plus, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, getCartTotal, clearCart } = useCartStore();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shipping = (subtotal - discountAmount) > 500 ? 0 : 40;
  const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const coupon = await validateCoupon(couponCode);
      if (coupon) {
        setAppliedCoupon(coupon);
        toast.success(`Coupon "${coupon.code}" applied!`);
      } else {
        toast.error('Invalid or expired coupon code');
      }
    } catch (error) {
      toast.error('Error validating coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser, items, navigate]);

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddresses(currentUser.uid);
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      } else {
        setShowAddressForm(true);
      }
    } catch (error) {
      toast.error('Failed to load addresses');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const added = await addAddress(currentUser.uid, newAddress);
      setAddresses([...addresses, added]);
      setSelectedAddressId(added.id);
      setShowAddressForm(false);
      toast.success('Address added!');
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const address = addresses.find(a => a.id === selectedAddressId);
      
      const farmerIds = [...new Set(items.map(item => item.farmerId).filter(id => !!id))];

      const orderData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Customer',
        userEmail: currentUser.email,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          unit: item.unit,
          farmerId: item.farmerId || 'SYSTEM' // Ensure it's never undefined
        })),
        farmerIds,
        subtotal,
        shippingFee: shipping,
        total,
        shippingAddress: address,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Success',
        orderStatus: 'Placed'
      };

      const result = await placeOrder(orderData);
      setPlacedOrderId(result.id);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      toast.error('Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="mb-10 flex items-center justify-between relative max-w-md mx-auto h-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  step >= s ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  step >= s ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
              </div>
            ))}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-0">
              <div 
                className="h-full bg-emerald-600 transition-all duration-300" 
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <MapPin className="text-emerald-600" /> Shipping Address
                  </h2>
                  {!showAddressForm && (
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Plus size={16} /> Add New
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" required placeholder="Full Name"
                      className="input-field col-span-2"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    />
                    <input 
                      type="text" required placeholder="Phone Number"
                      className="input-field"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    />
                    <select 
                      className="input-field"
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                    <input 
                      type="text" required placeholder="Flat / House / Street"
                      className="input-field col-span-2"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    />
                    <input 
                      type="text" required placeholder="City"
                      className="input-field"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    <input 
                      type="text" required placeholder="State"
                      className="input-field"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    />
                    <input 
                      type="text" required placeholder="Pincode"
                      className="input-field"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    />
                    <div className="col-span-2 flex gap-3 mt-4">
                      <button type="submit" disabled={loading} className="btn-primary flex-1">
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Address'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddressForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                          selectedAddressId === addr.id 
                          ? 'border-emerald-600 bg-emerald-50/50' 
                          : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        {selectedAddressId === addr.id && (
                          <div className="absolute top-3 right-3 text-emerald-600">
                            <CheckCircle2 size={18} />
                          </div>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 block">{addr.type}</span>
                        <p className="font-bold text-gray-900">{addr.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{addr.street}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm text-gray-900 font-bold mt-2">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {!showAddressForm && (
                <button 
                  onClick={nextStep}
                  className="w-full btn-primary !py-4 text-lg"
                >
                  Continue to Payment <ChevronRight className="ml-2 inline" />
                </button>
              )}
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
                  <CreditCard className="text-emerald-600" /> Payment Method
                </h2>

                <div className="space-y-4">
                  {[
                    { id: 'COD', name: 'Cash on Delivery', desc: 'Pay when you receive the products', icon: Truck },
                    { id: 'UPI', name: 'UPI Payment', desc: 'Coming Soon - Google Pay, PhonePe, Paytm', icon: AlertCircle, disabled: true },
                    { id: 'Card', name: 'Credit / Debit Card', desc: 'Coming Soon - Secure online payment', icon: CreditCard, disabled: true },
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id 
                        ? 'border-emerald-600 bg-emerald-50/50' 
                        : method.disabled ? 'opacity-50 cursor-not-allowed border-gray-50 shadow-none' : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id}
                        className="hidden"
                        checked={paymentMethod === method.id}
                        onChange={() => !method.disabled && setPaymentMethod(method.id)}
                        disabled={method.disabled}
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <method.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500">
                          {method.disabled ? 'Currently unavailable' : method.desc}
                        </p>
                      </div>
                      {paymentMethod === method.id && <CheckCircle2 size={18} className="text-emerald-600" />}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="btn-secondary flex-1 py-4">Back</button>
                <button onClick={nextStep} className="btn-primary flex-[2] py-4">Review Order <ChevronRight className="ml-2 inline" /></button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 mb-8">Review Your Order</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Shipping To</h3>
                    <div className="text-gray-900">
                      {addresses.find(a => a.id === selectedAddressId)?.name}<br/>
                      {addresses.find(a => a.id === selectedAddressId)?.street}<br/>
                      {addresses.find(a => a.id === selectedAddressId)?.city}, {addresses.find(a => a.id === selectedAddressId)?.state} - {addresses.find(a => a.id === selectedAddressId)?.pincode}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Method</h3>
                    <div className="font-bold text-gray-900">
                      {paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                      </div>
                      <p className="font-bold text-gray-900 whitespace-nowrap">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="btn-secondary flex-1 py-4">Back</button>
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={loading}
                  className="btn-primary flex-[2] py-4 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : `Place Order • ₹${total}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6">Order Details</h3>
            
            {/* Coupon Code Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Have a coupon?</label>
              {appliedCoupon ? (
                <>
                  <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-800">{appliedCoupon.code}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs font-bold text-red-500 hover:text-red-600 px-2">Remove</button>
                  </div>
                  {appliedCoupon.description && (
                    <p className="mt-2 text-[10px] font-medium text-emerald-600/70 italic px-1">
                      "{appliedCoupon.description}"
                    </p>
                  )}
                </>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 uppercase font-bold"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span className="text-gray-900 font-bold">₹{subtotal}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1">Discount ({appliedCoupon.discount}%)</span>
                  <span className="font-bold">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee</span>
                <span className={`font-bold ${shipping === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600/70 text-[10px] font-black uppercase tracking-widest pt-2">
                <span>Included Tax (GST 5%)</span>
                <span>₹{(total * 5 / 105).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between">
                <span className="text-base font-black text-gray-900 uppercase">Total Amount</span>
                <span className="text-2xl font-black text-emerald-600">₹{total}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex-shrink-0 flex items-center justify-center">
                <Truck size={14} />
              </div>
              <p className="text-[10px] sm:text-xs text-emerald-800 font-medium">
                Free standard delivery on all orders above <span className="font-bold">₹500</span>. Estimated delivery: 1-2 days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS OVERLAY */}
      {orderPlaced && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-700 delay-200">
            <div className="relative">
              <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border-8 border-emerald-50">
                <CheckCircle2 size={64} className="animate-in slide-in-from-bottom-4 duration-1000" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400/10 rounded-full animate-ping -z-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order Placed!</h1>
              <p className="text-gray-500 font-medium text-lg italic">"Freshness is on its way to your door"</p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Number</span>
                <span className="text-sm font-black text-emerald-600">#{placedOrderId.slice(-6).toUpperCase()}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Thank you for supporting local farmers. You'll receive a confirmation email shortly.
              </p>
            </div>

            <button 
              onClick={() => navigate(`/order-success/${placedOrderId}`)}
              className="w-full btn-primary !py-5 text-lg flex items-center justify-center gap-2 group"
            >
              Continue to Details 
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
