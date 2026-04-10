import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../services/orderService';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders(currentUser.uid);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Placed': return Clock;
      case 'Shipped': return Truck;
      case 'Delivered': return CheckCircle2;
      case 'Cancelled': return AlertCircle;
      default: return Package;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <Package size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
        <p className="text-gray-500 mb-8">You haven't placed any orders yet. Time to go shopping!</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag size={18} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-500 font-medium">Track your recent orders and their status</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          const formattedDate = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }) : 'Recently';

          return (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
                {/* Order Meta */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)} flex items-center gap-1.5`}>
                      <StatusIcon size={12} />
                      {order.orderStatus || order.status}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={12} />
                      {formattedDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <Package className="text-gray-300" size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">Order #{order.id.slice(-6).toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">{order.items.length} items • ₹{order.total}</p>
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="hidden lg:flex items-center gap-2 pr-6 border-r border-gray-50">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                      <img 
                        src={item.imageUrl || item.image || item.prodImage || item.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                {/* Action */}
                <div>
                  <Link 
                    to={`/account/orders/${order.id}`}
                    className="w-full md:w-auto btn-secondary !py-3 px-6 flex items-center justify-center gap-2 group-hover:bg-gray-100"
                  >
                    View Details <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
