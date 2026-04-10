import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { cancelOrder } from '../../services/orderService';
import { getUserProfile } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import ReviewForm from '../../components/review/ReviewForm';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard,
  Loader2,
  AlertCircle,
  User,
  MessageSquare,
  PhoneCall,
  XCircle
} from 'lucide-react';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState({});
  const [cancelling, setCancelling] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    const docRef = doc(db, 'orders', orderId);
    
    // Use onSnapshot for real-time updates from farmer
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const orderData = { id: docSnap.id, ...docSnap.data() };
        setOrder(orderData);
        
        // Fetch farmer profiles for all unique farmerIds in the order
        const farmerIds = [...new Set(orderData.items.map(item => item.farmerId).filter(Boolean))];
        const farmerProfiles = {};
        
        await Promise.all(farmerIds.map(async (id) => {
          try {
            const profile = await getUserProfile(id);
            if (profile) farmerProfiles[id] = profile;
          } catch (err) {
            console.error(`Error fetching profile for farmer ${id}:`, err);
          }
        }));
        setFarmers(farmerProfiles);
      } else {
        setOrder(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to order details:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      setCancelling(true);
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Retrieving Order Status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-8 font-medium">We couldn't find the details for this order. It might have been removed or the ID is incorrect.</p>
        <Link to="/account/orders" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Back to My Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Placed', icon: Clock, date: order.createdAt, active: true },
    { label: 'Shipped', icon: Truck, date: order.shippedAt, active: ['Shipped', 'Delivered'].includes(order.status) },
    { label: 'Delivered', icon: CheckCircle2, date: order.deliveredAt, active: order.status === 'Delivered' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <Link to="/account/orders" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to My Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Order Details</h1>
            <p className="text-gray-500 font-medium">#{orderId.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            {order.status === 'Placed' && (
              <button 
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="btn-outline border-red-200 text-red-600 hover:bg-red-50 !py-2 !px-4 text-xs font-black flex items-center gap-2"
              >
                {cancelling ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Cancel Order
              </button>
            )}
            <div className={`px-4 py-2 rounded-2xl border text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
              order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
              'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {order.status === 'Delivered' ? <CheckCircle2 size={16} /> : 
               order.status === 'Shipped' ? <Truck size={16} /> : 
               order.status === 'Cancelled' ? <XCircle size={16} /> : <Clock size={16} />}
              {order.status}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Stepper */}
      {order.status !== 'Cancelled' && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 sm:p-12">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                  step.active ? 'bg-emerald-600 border-emerald-100 text-white' : 'bg-white border-gray-100 text-gray-300'
                }`}>
                  <step.icon size={20} />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-black uppercase tracking-widest ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {step.date && <p className="text-[10px] text-gray-400 font-bold mt-1">
                    {step.date.toDate ? step.date.toDate().toLocaleDateString() : 'Dec 24, 2023'}
                  </p>}
                </div>
              </div>
            ))}
            {/* Progress Line */}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-50 -z-0">
              <div 
                className="h-full bg-emerald-600 transition-all duration-1000" 
                style={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '50%' : '0%' }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <Package className="text-emerald-500" /> Items in Order
            </h3>
            <div className="divide-y divide-gray-50">
              {order.items.map((item, idx) => {
                const farmer = farmers[item.farmerId];
                return (
                  <div key={idx} className="py-6 first:pt-0 last:pb-0 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <img 
                          src={item.imageUrl || item.image || item.prodImage || item.thumbnail} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-lg line-clamp-1">{item.name}</p>
                        <p className="text-sm text-gray-500 font-medium">{item.quantity} x ₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-black text-gray-900 text-lg">₹{item.price * item.quantity}</p>
                        {order.status === 'Delivered' && (
                          <button 
                            onClick={() => {
                              setSelectedProduct({
                                id: item.productId || item.id, // Fallback to item.id if productId is missing
                                name: item.name,
                                farmerId: item.farmerId
                              });
                              setIsReviewModalOpen(true);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            Rate Product
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Seller Info */}
                    {farmer && (
                      <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Sold by</p>
                            <p className="text-xs font-bold text-gray-900">{farmer.displayName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {farmer.phoneNumber && (
                            <a href={`tel:${farmer.phoneNumber}`} className="p-2 bg-white text-emerald-600 rounded-xl border border-gray-100 hover:bg-emerald-50 transition-colors shadow-sm" title="Call Farmer">
                              <PhoneCall size={14} />
                            </a>
                          )}
                          <button className="p-2 bg-white text-blue-600 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors shadow-sm" title="Message Farmer">
                            <MessageSquare size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-emerald-500" /> Delivery Address
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="font-black text-gray-900 mb-1">{order.shippingAddress?.name}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.shippingAddress?.street}<br/>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-900">
                <span className="text-gray-400 uppercase tracking-widest text-[10px]">Contact:</span> {order.shippingAddress?.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6">Payment Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600">₹{order.shippingFee || '0'}</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center bg-emerald-50 -mx-8 px-8 py-4 mt-4">
                <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-2xl font-black text-emerald-600">₹{order.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard size={20} />
                <span className="font-bold text-sm">Payment Method</span>
              </div>
              <p className="text-3xl font-black uppercase tracking-tighter">
                {order.paymentMethod === 'COD' ? 'Cash' : order.paymentMethod}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-full w-fit">
                <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'Success' ? 'bg-white' : 'bg-orange-300 animate-pulse'}`} />
                {order.paymentStatus}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                 <AlertCircle size={24} />
               </div>
               <div>
                 <p className="text-sm font-black text-gray-900">Need Help with Order?</p>
                 <p className="text-xs text-gray-400 font-medium">Our support team is available 24/7</p>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <a href="tel:+1234567890" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all group">
                  <PhoneCall size={20} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-emerald-600">Call Us</span>
                </a>
                <Link to="/contact" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all group">
                  <MessageSquare size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-blue-600">Email Us</span>
                </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewForm
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          userId={currentUser?.uid}
          userName={currentUser?.displayName || "Valued Customer"}
        />
      )}
    </div>
  );
};

export default OrderDetail;
