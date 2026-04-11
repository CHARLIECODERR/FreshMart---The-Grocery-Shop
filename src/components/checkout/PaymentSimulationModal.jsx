import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  X, 
  Loader2, 
  Smartphone,
  Lock,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSimulationModal = ({ isOpen, onClose, onPaymentSuccess, amount }) => {
  const [step, setStep] = useState(1); // 1: Select, 2: Waiting/Verifying, 3: Success
  const [paymentType, setPaymentType] = useState('qr'); 
  const [isScanned, setIsScanned] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minute countdown like real gateways

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setPaymentType('qr');
      setIsScanned(false);
      setTimer(300);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
          setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulateApproval = () => {
    toast.loading("Verifying transaction with bank...", { id: 'amazon_pay' });
    setTimeout(() => {
        setStep(3);
        toast.success("Payment Received!", { id: 'amazon_pay' });
        setTimeout(onPaymentSuccess, 2000);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-lg bg-white shadow-2xl overflow-hidden border border-gray-200 font-sans"
        style={{ borderRadius: '8px' }} // Amazon uses slightly rounded corners, not massive ones
      >
        {/* FreshMart Header */}
        <div className="bg-[#fbfcff] px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">FreshMart Pay</div>
                <h3 className="text-sm font-black text-gray-800 tracking-tight">Secure Payment Gateway</h3>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"><X size={18} /></button>
        </div>

        <div className="p-0">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order Amount:</span>
                            <span className="text-2xl font-black text-emerald-600">₹{amount}.00</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setPaymentType('qr')}
                                className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${paymentType === 'qr' ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100'}`}
                            >
                                <div className="text-[10px] font-black text-gray-300 uppercase">Step 1</div>
                                <span className="font-black text-xs text-gray-700">Scan QR Code</span>
                            </button>
                            <button 
                                onClick={() => setPaymentType('id')}
                                className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${paymentType === 'id' ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100'}`}
                            >
                                <div className="text-[10px] font-black text-gray-300 uppercase">Step 2</div>
                                <span className="font-black text-xs text-gray-700">Use UPI ID</span>
                            </button>
                        </div>

                        {paymentType === 'qr' ? (
                            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                                <img src="/freshmart_upi_qr.png" alt="QR" className="w-40 h-40 border-4 border-white shadow-xl rounded-2xl" />
                                <div className="text-center">
                                    <p className="text-xs font-black text-gray-600 uppercase tracking-tight">Scan with any UPI App</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-bold">GPay | PhonePe | Paytm | Any Bank App</p>
                                </div>
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest"
                                >
                                    Verify Payment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Your UPI ID</label>
                                    <input 
                                        type="text" placeholder="mobile@upi" 
                                        className="w-full border-2 border-gray-100 px-4 py-4 rounded-2xl focus:border-emerald-500 outline-none text-sm font-bold text-gray-700"
                                        defaultValue="customer@okaxis"
                                    />
                                </div>
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest"
                                >
                                    Verify and Pay
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 flex flex-col items-center text-center space-y-8">
                        <div className="w-16 h-16 relative">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-full h-full border-4 border-gray-100 border-t-emerald-500 rounded-full"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-xl font-black text-gray-800 tracking-tight">Waiting for your approval</h4>
                            <div className="flex items-center justify-center gap-2 text-red-500 font-black text-sm bg-red-50 py-1 px-3 rounded-full w-fit mx-auto">
                                <Clock size={16} /> {formatTime(timer)}
                            </div>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                Please open your <span className="font-black text-gray-700">UPI Mobile App</span> and approve the payment request of <span className="font-black text-emerald-600">₹{amount}.00</span>
                            </p>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-left flex gap-3">
                                <AlertCircle className="text-emerald-500 shrink-0" size={18} />
                                <p className="text-[11px] text-emerald-700 font-bold leading-normal">
                                    Do not close this window or click back button until the payment is verified.
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleSimulateApproval}
                                className="w-full bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-400 transition-colors py-2 border border-dashed border-gray-200 rounded-xl"
                            >
                                [ Simulation: Confirm Mobile Approval ]
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-xl">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-black text-gray-800">Order Confirmed!</h4>
                            <p className="text-sm text-gray-400 font-medium">Thank you for your payment.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* FreshMart Footer */}
        <div className="px-8 py-6 bg-slate-50 border-t border-gray-100 flex flex-col items-center gap-3">
            <div className="flex items-center gap-8 opacity-30 grayscale">
                <ShieldCheck size={28} />
                <Lock size={20} />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Securely Processed via FreshMart Payment Gateway
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSimulationModal;
