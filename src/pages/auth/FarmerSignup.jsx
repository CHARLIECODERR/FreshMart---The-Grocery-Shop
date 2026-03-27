import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { uploadToCloudinary } from '../../services/productService';
import OTPVerification from '../../components/OTPVerification';
import toast from 'react-hot-toast';
import {
  Sprout, User, Phone, MapPin, Landmark,
  FileText, Upload, ShieldCheck, Loader2, CheckCircle2,
  ArrowRight, ArrowLeft, Eye, EyeOff, Smartphone
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Account',      icon: User },
  { id: 2, label: 'Farm Info',    icon: Landmark },
  { id: 3, label: 'Documents',    icon: ShieldCheck },
  { id: 4, label: 'Verify OTP',   icon: Smartphone },
];

const inputCls = (err) =>
  `w-full bg-slate-50 border-2 rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-900 placeholder:text-slate-300 transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 ${err ? 'border-red-300 bg-red-50/30' : 'border-transparent'}`;

const FieldError = ({ msg }) =>
  msg ? <p className="text-red-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{msg}</p> : null;

const FarmerSignup = () => {
  const { signup, currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [mobileVerified, setMobileVerified] = useState(false);

  const [form, setForm] = useState({
    // Step 1 — Account
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2 — Farm Info
    farmName: '',
    legalName: '',
    phone: '',
    farmType: '',
    pincode: '',
    address: '',
    // Step 3 — Verification (document)
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser && role) {
      if (role === 'farmer') navigate('/farmer');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    }
  }, [currentUser, role, navigate]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const err = (k) => errors[k];

  // ─── Validation per step ────────────────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Full name is required (min 2 chars)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.farmName.trim()) e.farmName = 'Farm / business name is required';
    if (!form.legalName.trim()) e.legalName = "Owner's legal name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!form.farmType) e.farmType = 'Please select a farm type';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    if (!form.address.trim() || form.address.trim().length < 10) e.address = 'Enter full address (min 10 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!idFile) e.idFile = 'Please upload your Government ID or Farm License';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(s => s + 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    setIdFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setIdPreview(reader.result);
    reader.readAsDataURL(file);
    setErrors(er => ({ ...er, idFile: null }));
  };

  const handleSubmit = async () => {
    if (!mobileVerified) {
      toast.error('Please verify your mobile number to proceed.');
      return;
    }
    try {
      setLoading(true);
      toast.loading('Creating your farmer account...', { id: 'farmer-signup' });

      // 1. Create Firebase Auth account + base Firestore doc
      const user = await signup(form.email, form.password, form.name, 'farmer');

      toast.loading('Uploading verification document...', { id: 'farmer-signup' });

      // 2. Upload ID document
      const documentUrl = await uploadToCloudinary(idFile);

      // 3. Update Firestore with KYC details + mobileVerified flag
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        farmName: form.farmName,
        legalName: form.legalName,
        phone: `+91${form.phone}`,
        farmType: form.farmType,
        pincode: form.pincode,
        address: form.address,
        documentUrl,
        mobileVerified: true,
        status: 'under_review',
        submittedAt: new Date().toISOString(),
      });

      toast.success('Registration submitted! You will be notified once approved.', { id: 'farmer-signup' });
      navigate('/farmer');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Registration failed. Please try again.', { id: 'farmer-signup' });
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────── Render ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center relative overflow-hidden p-4">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-400 rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-2xl shadow-emerald-950/50 mx-auto mb-4 hover:scale-110 transition-transform">
              <img src="/logo.png" alt="FreshMart" className="w-full h-full object-contain" />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sprout className="text-emerald-400" size={20} />
            <span className="text-emerald-400 text-[11px] font-black uppercase tracking-[0.3em]">Farmer Partner Program</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Join as a supplier</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Complete your profile to start selling wholesale</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all font-black text-sm ${
                  step > s.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                  step === s.id ? 'bg-white text-emerald-700 shadow-xl ring-4 ring-white/20' :
                  'bg-white/10 text-slate-400'
                }`}>
                  {step > s.id ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${step === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-14 mx-1 mb-4 rounded transition-all ${step > s.id ? 'bg-emerald-500' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="p-8 lg:p-10">

            {/* ── STEP 1: Account ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2"><User size={20} className="text-emerald-500" /> Account Details</h2>
                  <p className="text-slate-400 text-sm font-medium">Set up your login credentials for the Farmer Portal.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Full Name *</label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls(err('name'))} placeholder="Your full legal name" />
                    <FieldError msg={err('name')} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Email Address *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls(err('email'))} placeholder="you@example.com" />
                    <FieldError msg={err('email')} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Password *</label>
                      <div className="relative">
                        <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} className={inputCls(err('password'))} placeholder="Min. 6 characters" />
                        <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FieldError msg={err('password')} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Confirm Password *</label>
                      <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} className={inputCls(err('confirmPassword'))} placeholder="Same as above" />
                      <FieldError msg={err('confirmPassword')} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Farm Info ── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2"><Landmark size={20} className="text-emerald-500" /> Farm / Business Info</h2>
                  <p className="text-slate-400 text-sm font-medium">Tell us about your farm so Admin can verify your identity.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Farm / Business Name *</label>
                      <input type="text" value={form.farmName} onChange={e => set('farmName', e.target.value)} className={inputCls(err('farmName'))} placeholder="e.g. Green Valley Farms" />
                      <FieldError msg={err('farmName')} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Owner's Legal Name *</label>
                      <input type="text" value={form.legalName} onChange={e => set('legalName', e.target.value)} className={inputCls(err('legalName'))} placeholder="As on Govt. ID" />
                      <FieldError msg={err('legalName')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Mobile Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls(err('phone')) + ' pl-10'} placeholder="10-digit number" />
                      </div>
                      <FieldError msg={err('phone')} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Farm Type *</label>
                      <select value={form.farmType} onChange={e => set('farmType', e.target.value)} className={inputCls(err('farmType'))}>
                        <option value="">Select type…</option>
                        <option>Crop / Grain Farm</option>
                        <option>Vegetable Farm</option>
                        <option>Fruit Orchard</option>
                        <option>Dairy Farm</option>
                        <option>Poultry Farm</option>
                        <option>Herb / Spice Farm</option>
                        <option>Organic Farm</option>
                        <option>Mixed / Other</option>
                      </select>
                      <FieldError msg={err('farmType')} />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Postal Pincode *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value)} className={inputCls(err('pincode')) + ' pl-10'} placeholder="6-digit pincode" />
                    </div>
                    <FieldError msg={err('pincode')} />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Complete Farm / Business Address *</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 text-slate-300" size={16} />
                      <textarea rows={3} value={form.address} onChange={e => set('address', e.target.value)} className={inputCls(err('address')) + ' pl-10 resize-none'} placeholder="Street, Taluka, District, State..." />
                    </div>
                    <FieldError msg={err('address')} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Document Upload ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500" /> Identity Verification</h2>
                  <p className="text-slate-400 text-sm font-medium">Upload a clear copy of your Government ID or Farm License to verify your identity.</p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  <div className="text-sm">
                    <p className="font-black text-amber-900 mb-0.5">Accepted Documents</p>
                    <p className="text-amber-700 font-medium text-xs leading-relaxed">Aadhar Card, PAN Card, Voter ID, Passport, Driving Licence, Farm Registration Certificate, or Business License</p>
                  </div>
                </div>

                <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all group ${err('idFile') ? 'border-red-300 bg-red-50/30' : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50'}`}>
                  <input type="file" accept="image/*,.pdf" id="kyc-doc" className="hidden" onChange={handleFileChange} />
                  <label htmlFor="kyc-doc" className="cursor-pointer flex flex-col items-center">
                    {idPreview ? (
                      <div className="relative w-56 h-36 mb-4 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-lg mx-auto">
                        <img src={idPreview} alt="Document Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-black bg-black/40 px-3 py-1 rounded-lg">Change File</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300 mb-4 shadow-sm group-hover:scale-110 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-all mx-auto">
                        <Upload size={32} />
                      </div>
                    )}
                    <p className="text-sm font-black text-slate-900">{idFile ? idFile.name : 'Click to upload your document'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">JPG, PNG, PDF — Max 5MB</p>
                  </label>
                </div>
                <FieldError msg={err('idFile')} />

                {/* Summary review */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Review Your Details</p>
                  {[
                    ['Name', form.name],
                    ['Email', form.email],
                    ['Farm', form.farmName],
                    ['Legal Name', form.legalName],
                    ['Phone', form.phone],
                    ['Farm Type', form.farmType],
                    ['Pincode', form.pincode],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="font-bold text-slate-400">{label}</span>
                      <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">{value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 4: OTP Verification ── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2"><Smartphone size={20} className="text-emerald-500" /> Verify Mobile Number</h2>
                  <p className="text-slate-400 text-sm font-medium">We need to confirm <span className="font-black text-slate-700">+91{form.phone}</span> belongs to you.</p>
                </div>

                <OTPVerification
                  phone={`+91${form.phone}`}
                  onVerified={() => setMobileVerified(true)}
                />
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="px-8 lg:px-10 pb-8 flex items-center gap-3">
            {step > 1 && !mobileVerified && (
              <button
                onClick={() => { setErrors({}); setStep(s => s - 1); }}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-50 border border-slate-100 transition-all disabled:opacity-50"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : mobileVerified ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            ) : null}
          </div>
        </div>

        {/* Existing account link */}
        <p className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-white transition-colors">Sign In</Link>
          {' · '}
          <Link to="/signup" className="text-emerald-400 hover:text-white transition-colors">Sign up as Customer</Link>
        </p>
      </div>
    </div>
  );
};

export default FarmerSignup;
