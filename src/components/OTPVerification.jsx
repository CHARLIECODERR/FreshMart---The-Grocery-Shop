import React, { useState, useEffect, useRef } from 'react';
import { Mail, ShieldCheck, Loader2, RefreshCcw } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const OTPVerification = ({ email, onVerified, className = '' }) => {
  const [otpSent, setOtpSent] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const OTP_MAX_ATTEMPTS = 3;
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const timerRef = useRef(null);
  const resendTimerRef = useRef(null);
  const hasSentRef = useRef(false);

  // ── Timers ───────────────────────────────────────────────
  const startTimer = (seconds = 60) => {
    setTimer(seconds);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const startResendTimer = (seconds = 60) => {
    setResendTimer(seconds);
    clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(resendTimerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const pk = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (pk) emailjs.init(pk);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(resendTimerRef.current);
    };
  }, []);

  // ── Auto-Send OTP on Mount ──────────────────────────────────────────────
  useEffect(() => {
    if (email && !sent && !sending && !hasSentRef.current) {
      hasSentRef.current = true;
      sendOTP();
    }
  }, [email]);

  // ── Send Email OTP ────────────────────────────────────────────────────────────
  const sendOTP = async () => {
    if (!email) { setError('Email address is required.'); return; }
    setError('');
    try {
      setSending(true);
      const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(freshOtp);

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
          throw new Error('EmailJS configuration missing in .env');
      }

      // 3. Send Email (Enhanced Parameters)
      const response = await emailjs.send(
        serviceId,
        templateId,
        { 
          to_email: email, 
          otp: freshOtp,
          verification_code: freshOtp,
          passcode: freshOtp,
          from_name: 'FreshMart Team',
          app_name: 'FreshMart',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        publicKey
      );

      if (response.status === 200) {
        setSent(true);
        setOtpAttempts(0);
        startTimer(60);
        startResendTimer(60);
        toast.success(`OTP sent to ${email}`);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      console.log('OTP Sending failed:', err);
      setError('OTP delivery failed. Please check your credentials.');
      toast.error('Verification email failed');
    } finally {
      setSending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpSent];
    next[index] = value.substring(value.length - 1);
    setOtpSent(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpSent[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (e) => {
    e?.preventDefault();
    const code = otpSent.join('');
    if (code.length !== 6) return;

    try {
      setVerifying(true);
      setError('');

      if (code === generatedOtp) {
        setVerified(true);
        toast.success('Email verified successfully');
        setTimeout(() => onVerified?.(), 1000);
      } else {
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);
        
        if (newAttempts >= OTP_MAX_ATTEMPTS) {
          setError('Too many failed attempts. Please resend a new OTP.');
          setSent(false);
          setOtpSent(['', '', '', '', '', '']);
        } else {
          setError(`Invalid OTP. ${OTP_MAX_ATTEMPTS - newAttempts} attempts left.`);
        }
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={`p-6 bg-white rounded-3xl border border-slate-100 ${className}`}>
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-4">
            <Mail className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-black text-emerald-900 leading-tight">Verify Your Email Address</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                An OTP has been sent to <span className="font-bold underline">{email}</span>
              </p>
            </div>
          </div>

          {!sent ? (
            <button
              onClick={sendOTP}
              disabled={sending}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-xl shadow-slate-200"
            >
              {sending ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
              {sending ? 'Sending OTP...' : 'Send Verification Email'}
            </button>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
                  Enter 6-Digit Code
                </p>
                <div className="flex gap-2 justify-center">
                  {otpSent.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => inputsRef.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className="w-10 h-14 sm:w-12 sm:h-16 text-center text-xl font-black bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-900"
                      disabled={verified || verifying}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] text-center font-black text-red-500 uppercase tracking-wider">{error}</p>
                </div>
              )}

              <button
                onClick={verifyOTP}
                disabled={verifying || verified || otpSent.join('').length < 6}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-xl shadow-emerald-200 disabled:opacity-50"
              >
                {verifying ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {verified ? 'Email Verified ✅' : 'Verify & Continue'}
              </button>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={sendOTP}
                  disabled={resendTimer > 0 || sending}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCcw size={12} className={sending ? 'animate-spin' : ''} />
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend Verification Code'}
                </button>
                {timer > 0 && !verified && (
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    Code expires in {timer}s
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
