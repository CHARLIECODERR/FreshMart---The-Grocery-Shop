import React, { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, linkWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Smartphone, ShieldCheck, Loader2, RefreshCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * OTPVerification Component
 * Props:
 *  phone          - phone string already with country code e.g. "+919876543210"
 *  onVerified     - callback() after OTP is confirmed
 *  linkedMode     - if true, uses linkWithPhoneNumber (for already-signed-in users)
 *  className      - optional extra classnames
 */
const OTPVerification = ({ phone, onVerified, linkedMode = false, className = '' }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const recaptchaRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);
  const timerRef = useRef(null);

  // ── Initialize reCAPTCHA ────────────────────────────────────────────────
  const initRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          recaptchaVerifierRef.current?.clear();
          recaptchaVerifierRef.current = null;
        },
      });
    }
    return recaptchaVerifierRef.current;
  };

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      recaptchaVerifierRef.current?.clear();
    };
  }, []);

  // ── Start countdown timer ───────────────────────────────────────────────
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

  // ── Send OTP ────────────────────────────────────────────────────────────
  const sendOTP = async () => {
    if (!phone) { setError('Phone number is required.'); return; }
    setError('');
    try {
      setSending(true);
      const verifier = initRecaptcha();
      // Use linkWithPhoneNumber if user already signed in, otherwise signInWithPhoneNumber
      let result;
      if (linkedMode && auth.currentUser) {
        result = await linkWithPhoneNumber(auth.currentUser, phone, verifier);
      } else {
        result = await signInWithPhoneNumber(auth, phone, verifier);
      }
      setConfirmationResult(result);
      setSent(true);
      startTimer(60);
      toast.success(`OTP sent to ${phone}`);
    } catch (err) {
      console.error('OTP send error:', err);
      // Reset reCAPTCHA on failure so it can be retried
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
      const msg = err.code === 'auth/invalid-phone-number'
        ? 'Invalid phone number. Make sure it starts with +91.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please wait a few minutes and try again.'
        : err.code === 'auth/provider-already-linked'
        ? 'This phone number is already linked to an account.'
        : `Failed to send OTP (${err.code || 'unknown'}). Check browser console for details.`;
      setError(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  // ── Handle OTP digit input ──────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError('');
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setOtp(digits);
      inputsRef.current[5]?.focus();
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────
  const verifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter all 6 digits.'); return; }
    setError('');
    try {
      setVerifying(true);
      await confirmationResult.confirm(code);
      setVerified(true);
      toast.success('📱 Phone number verified!');
      onVerified?.();
    } catch (err) {
      console.error(err);
      const msg = err.code === 'auth/invalid-verification-code'
        ? 'Incorrect OTP. Please try again.'
        : err.code === 'auth/code-expired'
        ? 'OTP expired. Please request a new one.'
        : 'Verification failed. Please try again.';
      setError(msg);
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-5 ${className}`} ref={recaptchaRef}>
      {/* invisible reCAPTCHA anchor */}
      <div id="recaptcha-container" />

      {!verified ? (
        <>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Smartphone className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-black text-blue-900 mb-0.5">Verify Your Mobile Number</p>
              <p className="text-xs text-blue-700 font-medium">
                An OTP will be sent to <span className="font-black">{phone}</span> via SMS.
              </p>
            </div>
          </div>

          {!sent ? (
            <button
              type="button"
              onClick={sendOTP}
              disabled={sending}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {sending ? <Loader2 className="animate-spin" size={18} /> : <Smartphone size={18} />}
              {sending ? 'Sending OTP…' : 'Send OTP to My Phone'}
            </button>
          ) : (
            <div className="space-y-5">
              {/* OTP Input boxes */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Enter 6-digit OTP</p>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => inputsRef.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-xl font-black rounded-2xl border-2 bg-slate-50 transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 ${
                        digit ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100' : 'border-transparent focus:border-emerald-400'
                      } ${error ? 'border-red-300 bg-red-50 text-red-700' : ''}`}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-wider text-center mt-2">{error}</p>
                )}
              </div>

              {/* Verify button */}
              <button
                type="button"
                onClick={verifyOTP}
                disabled={verifying || otp.join('').length < 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-xl shadow-emerald-100 disabled:opacity-50 disabled:pointer-events-none"
              >
                {verifying ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {verifying ? 'Verifying…' : 'Confirm OTP'}
              </button>

              {/* Timer + Resend */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-xs font-bold text-slate-400">
                    Resend OTP in{' '}
                    <span className="font-black text-slate-700 tabular-nums">
                      0:{timer.toString().padStart(2, '0')}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={sending}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-800 transition-colors disabled:opacity-50"
                  >
                    <RefreshCcw size={14} />
                    {sending ? 'Resending…' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Verified success state */
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 shadow-xl">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-900">Phone Verified!</p>
            <p className="text-sm font-medium text-slate-400 mt-1">{phone} is now verified.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
