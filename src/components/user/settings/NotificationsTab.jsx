import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingBag, Sprout, Gift, Mail, Send } from 'lucide-react';

const NotificationsTab = ({ 
  notifs, 
  toggleNotif, 
  sendTestNotification 
}) => {
  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 space-y-10"
    >
      <div>
         <h3 className="text-2xl font-black text-gray-900 mb-2">Notification Center</h3>
         <p className="text-gray-500 font-medium">Control how and when we reach out to you.</p>
      </div>

      <div className="space-y-4">
        {[
          { key: 'orderUpdates', label: 'Order Analytics', desc: 'Real-time updates on your delivery and order status.', icon: ShoppingBag },
          { key: 'newProducts', label: 'In-Stock Alerts', desc: 'Get notified when seasonal harvests are live.', icon: Sprout },
          { key: 'promotions', label: 'Marketing Offers', desc: 'Be the first to know about discounts and coupons.', icon: Gift },
          { key: 'smsAlerts', label: 'Tactical SMS', desc: 'Direct critical updates via text message.', icon: Mail }
        ].map((item, idx) => {
          const Icon = item.icon || Bell;
          return (
            <div key={idx} className="flex items-center justify-between p-6 rounded-[2rem] border border-gray-50 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                   <Icon size={22} />
                </div>
                <div>
                  <p className="font-black text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotif(item.key)}
                className={`w-14 h-8 rounded-full relative transition-colors ${notifs[item.key] ? 'bg-emerald-600' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: notifs[item.key] ? 28 : 4 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          )
        })}

        <div className="pt-6">
          <button 
            onClick={sendTestNotification}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 font-black text-sm p-4 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all"
          >
            <Send size={18} /> Test Notification System
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(NotificationsTab);
