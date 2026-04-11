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
        {/* Amazon Header */}
        <div className="bg-[#f3f3f3] px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-[#232f3e] text-white px-2 py-1 rounded text-[10px] font-bold">Amazon Pay</div>
                <h3 className="text-sm font-bold text-gray-700">Secure Checkout</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="p-0">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <span className="text-sm font-medium text-gray-600">Order Total:</span>
                            <span className="text-xl font-bold text-red-700 font-serif">₹{amount}.00</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setPaymentType('qr')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${paymentType === 'qr' ? 'border-orange-400 bg-orange-50/30' : 'border-gray-100'}`}
                            >
                                <div className="text-[10px] font-bold text-gray-400 uppercase">Option 1</div>
                                <span className="font-bold text-sm">Scan QR Code</span>
                            </button>
                            <button 
                                onClick={() => setPaymentType('id')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${paymentType === 'id' ? 'border-orange-400 bg-orange-50/30' : 'border-gray-100'}`}
                            >
                                <div className="text-[10px] font-bold text-gray-400 uppercase">Option 2</div>
                                <span className="font-bold text-sm">Use UPI ID</span>
                            </button>
                        </div>

                        {paymentType === 'qr' ? (
                            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg space-y-4">
                                <img src="/freshmart_upi_qr.png" alt="QR" className="w-40 h-40 border-4 border-white shadow-sm" />
                                <div className="text-center">
                                    <p className="text-xs font-bold text-gray-600">Scan this QR code with any UPI App</p>
                                    <p className="text-[10px] text-gray-400 mt-1">GPay, PhonePe, Paytm, Amazon Pay</p>
                                </div>
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full bg-[#f0c14b] hover:bg-[#ebae12] text-gray-900 py-3 rounded border border-[#a88734] font-medium text-sm shadow-sm"
                                >
                                    Verify Payment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input 
                                    type="text" placeholder="Enter UPI ID (e.g. mobile@upi)" 
                                    className="w-full border border-gray-300 px-4 py-3 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                                    defaultValue="customer@okaxis"
                                />
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full bg-[#f0c14b] hover:bg-[#ebae12] text-gray-900 py-3 rounded border border-[#a88734] font-medium text-sm shadow-sm"
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
                                className="w-full h-full border-4 border-gray-100 border-t-orange-400 rounded-full"
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-800 tracking-tight">Waiting for your approval</h4>
                            <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-sm">
                                <Clock size={16} /> {formatTime(timer)}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                                Please open your <span className="font-bold text-gray-700">UPI Mobile App</span> and approve the payment request of <span className="font-bold text-red-700">₹{amount}</span>.
                            </p>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded text-left flex gap-3">
                                <AlertCircle className="text-blue-500 shrink-0" size={18} />
                                <p className="text-[11px] text-blue-700 font-medium">
                                    Do not close this window or click back button until the payment is complete.
                                </p>
                            </div>
                            
                            {/* MOCK CONTROL FOR ADMIN/USER TO FEEL THE MAGIC */}
                            <button 
                                onClick={handleSimulateApproval}
                                className="w-full bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-400 transition-colors py-2 border border-dashed border-gray-200"
                            >
                                [ Simulation: Mock App Approval ]
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100 shadow-sm">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-gray-800">Payment Successful</h4>
                            <p className="text-sm text-gray-500">Redirecting you back to FreshMart...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Amazon Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col items-center gap-3">
            <div className="flex items-center gap-6 opacity-40 grayscale">
                <ShieldCheck size={28} />
                <Lock size={20} />
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                Payments are processed securely via Amazon Pay 256-bit SSL encryption.
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSimulationModal;
