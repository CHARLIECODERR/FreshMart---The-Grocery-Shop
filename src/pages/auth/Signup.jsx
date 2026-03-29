import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import OTPVerification from '../../components/OTPVerification';
import toast from 'react-hot-toast';
import { User, Loader2, ShieldPlus, Phone, CheckCircle2 } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required to secure your account'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirmation password must match",
  path: ["confirmPassword"]
});

const Signup = () => {
  const { signup, loginWithGoogle, currentUser, role } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  useEffect(() => {
    if (currentUser && role) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'farmer') navigate('/farmer');
      else navigate('/');
    }
  }, [currentUser, role, navigate]);

  const onSubmit = async (data) => {
    // Validate phone before submitting (optional)
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setPhoneError('');
    
    // ⚠️ DO NOT create user yet. Just save data and show OTP.
    setPendingData(data);
    setShowOTP(true);
    toast.success('Please verify your email to complete registration.');
  };

  // Called when OTP is confirmed
  const handleOTPVerified = async () => {
    try {
      if (!pendingData) return;
      setIsLoading(true);
      
      // 1. Create the Firebase Auth account
      const user = await signup(pendingData.email, pendingData.password, pendingData.name, 'customer');
      
      // 2. Mark as verified in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        phone: phone ? `+91${phone}` : '',
        emailVerified: true,
      });

      toast.success('Welcome to the FreshMart family!');
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Registration failed.');
      setShowOTP(false); // Back to form if it failed
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle(selectedRole);
      toast.success(selectedRole === 'farmer' ? 'Google Sign Up (Farmer)!' : 'Successfully established Google identity!');
    } catch (error) {
      console.error(error);
      toast.error('Google synchronization failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Clean Background */}
      <div className="fixed inset-0 -z-10 bg-slate-50/50" />

      <div className="w-full max-w-md mx-auto px-4 py-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Centered Logo Section */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Link to="/" className="shrink-0 mb-3">
            <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl shadow-emerald-100/50 border border-emerald-50 hover:scale-110 transition-transform duration-300">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            {showOTP ? 'Verify Your Email' : 'Create Account'}
          </h1>
          <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.2em] mt-0.5">
            {showOTP ? 'OTP sent to your email' : 'Join the FreshMart Community'}
          </p>
        </div>

        <div className="bg-white p-6 lg:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 rounded-[2.5rem] relative overflow-hidden backdrop-blur-sm">
          <div className="relative z-10">

            {!showOTP ? (
              <>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                    <input
                      type="text"
                      {...register('name')}
                      className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-5 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 ${errors.name ? 'border-red-100 bg-red-50/30' : ''}`}
                      placeholder="Enter your name"
                    />
                    {errors.name && <p className="text-red-500 text-[9px] font-black uppercase tracking-wider pl-2">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-5 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 ${errors.email ? 'border-red-100 bg-red-50/30' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-[9px] font-black uppercase tracking-wider pl-2">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Password</label>
                      <input
                        type="password"
                        {...register('password')}
                        className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-4 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 ${errors.password ? 'border-red-100 bg-red-50/30' : ''}`}
                        placeholder="Min 6 chars"
                      />
                      {errors.password && <p className="text-red-500 text-[9px] font-black uppercase tracking-wider pl-2">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Confirm</label>
                      <input
                        type="password"
                        {...register('confirmPassword')}
                        className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-4 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 ${errors.confirmPassword ? 'border-red-100 bg-red-50/30' : ''}`}
                        placeholder="Same password"
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-[9px] font-black uppercase tracking-wider pl-2">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mobile Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                        className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 pl-16 pr-5 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 ${phoneError ? 'border-red-100 bg-red-50/30' : ''}`}
                        placeholder="10-digit number"
                      />
                    </div>
                    {phoneError && <p className="text-red-500 text-[9px] font-black uppercase tracking-wider pl-2">{phoneError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-emerald-500 text-white flex justify-center items-center py-4 mt-1 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <ShieldPlus className="mr-2" size={16} />}
                    {isLoading ? 'Creating Account...' : 'Sign Up & Verify Email'}
                  </button>
                </form>

                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <span className="relative px-3 bg-white text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Or</span>
                </div>

                <button
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex justify-center items-center gap-3 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-black text-[11px] hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all active:scale-[0.98] group"
                >
                  {isGoogleLoading ? <Loader2 className="animate-spin text-emerald-500" size={16} /> : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.9 0 3.51.68 4.71 1.8l3.39-3.39C17.9 1.51 15.21 1 12 1 7.24 1 3.2 3.73 1.25 7.74l3.84 2.98C6.01 7.73 8.78 5.04 12 5.04z" />
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#FBBC05" d="M5.09 14.28c-.21-.63-.33-1.3-.33-2s.12-1.37.33-2l-3.84-2.98C.46 8.72 0 10.31 0 12s.46 3.28 1.25 4.7l3.84-2.98c-.21-.63-.33-1.3-.33-2.42z" />
                        <path fill="#34A853" d="M12 23c3.21 0 5.9-1.06 7.87-2.87l-3.57-2.77c-1.1.74-2.5 1.18-4.3 1.18-3.22 0-5.99-2.69-6.91-4.68l-3.84 2.98C3.2 20.27 7.24 23 12 23z" />
                      </svg>
                      <span>Google Sign Up</span>
                    </>
                  )}
                </button>

                <div className="mt-8 text-center pt-4 border-t border-slate-50">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                    Registered?{' '}
                    <Link to="/login" className="text-emerald-600 font-black hover:underline underline-offset-4 ml-1">Sign In</Link>
                  </p>
                </div>
                
                <div className="mt-4 p-4 border-2 border-dashed border-emerald-100 bg-emerald-50/50 rounded-2xl text-center hover:border-emerald-200 transition-colors">
                  <p className="text-xs font-bold text-slate-600 mb-1">Are you a Farmer/Supplier?</p>
                  <Link to="/farmer-signup" className="text-emerald-600 font-black text-sm hover:underline">
                    Register as a Farmer Partner
                  </Link>
                </div>
              </>
            ) : (
              /* ── OTP Verification Screen ── */
              <OTPVerification
                email={pendingData?.email}
                onVerified={handleOTPVerified}
              />
            )}

          </div>
        </div>

        
        <div className="mt-8 text-center flex justify-center gap-8">
           <Link to="/" className="text-slate-100 hover:text-white font-black text-[9px] uppercase tracking-widest transition-colors drop-shadow-md">Home</Link>
           <Link to="/about" className="text-slate-100 hover:text-white font-black text-[9px] uppercase tracking-widest transition-colors drop-shadow-md">About</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
