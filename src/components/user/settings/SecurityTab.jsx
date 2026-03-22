import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

const SecurityTab = ({ 
  passwords, 
  setPasswords, 
  handlePasswordUpdate, 
  showPass, 
  setShowPass, 
  loading 
}) => {
  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 space-y-10"
    >
      <div>
         <h3 className="text-2xl font-black text-gray-900 mb-2">Security & Access</h3>
         <p className="text-gray-500 font-medium">Keep your account safe and up to date.</p>
      </div>

      <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 gap-8 max-w-xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
            <div className="relative">
              <input 
                type={showPass ? 'text' : 'password'} 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium pr-14"
                placeholder="Min 6 characters"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm New Password</label>
            <input 
              type={showPass ? 'text' : 'password'} 
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium"
              placeholder="Repeat new password"
              required
            />
          </div>
        </div>

        <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex gap-4">
           <Shield className="text-orange-500 shrink-0" size={24} />
           <p className="text-xs text-orange-600 font-medium leading-relaxed">
             Changing your password will sign you out of all other sessions for security purposes.
           </p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-slate-900 text-white w-full md:w-auto px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2"
        >
          <Lock size={18} /> {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <div className="pt-10 border-t border-gray-50">
         <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Login Activity</h4>
         <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <CheckCircle2 size={20} />
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-900">Current Session</p>
                  <p className="text-xs text-gray-400 font-medium">Logged in from Mumbai, India</p>
               </div>
            </div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Active Now</span>
         </div>
      </div>
    </motion.div>
  );
};

export default React.memo(SecurityTab);
