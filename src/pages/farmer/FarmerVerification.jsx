import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { uploadToCloudinary } from '../../services/productService';
import { ShieldCheck, Upload, Loader2, Landmark, User, FileText, AlertCircle, Phone, MapPin, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerVerification = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    legalName: '',
    phone: '',
    address: '',
    pincode: ''
  });
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  // If status is under review, show pending screen
  if (userData?.status === 'under_review') {
    return (
      <div className="flex flex-col items-center justify-center p-8 lg:p-20 min-h-[60vh] max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 rounded-full" />
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-100 shadow-xl relative z-10 text-amber-500">
            <ShieldCheck size={48} className="animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verification Under Review</h2>
          <p className="text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
            Your KYC details are currently being reviewed by our Admin team. This process usually takes 1-2 business days. 
            Once approved, your dashboard will be fully unlocked.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-inner w-full flex items-start gap-4 text-left">
           <AlertCircle className="text-amber-500 shrink-0 mt-0.5" />
           <div>
              <p className="text-sm font-bold text-slate-900 mb-1">Hang tight!</p>
              <p className="text-xs text-slate-500">We will notify you once your application is approved. You cannot submit wholesale offers until verification is complete.</p>
           </div>
        </div>
      </div>
    );
  }

  // If status is rejected, show error and allow re-submit
  const isRejected = userData?.status === 'rejected';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         toast.error("File size should be less than 5MB");
         return;
      }
      setIdFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setIdPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idFile) {
      toast.error('Please upload a valid Govt ID or Farm License');
      return;
    }

    if (!formData.farmName || !formData.legalName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Uploading documents...', { id: 'kyc' });

      // Upload ID securely
      const documentUrl = await uploadToCloudinary(idFile, 'farmer_kyc');

      // Update Firestore
      const verificationData = {
        ...formData,
        documentUrl,
        status: 'under_review',
        submittedAt: new Date().toISOString()
      };

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, verificationData);

      // Force a reload so AuthContext picks up new status, or usually it listens automatically.
      // But we can trigger a manual reload to ensure proper rendering if needed
      window.location.reload(); 
      toast.success('KYC Application Submitted!', { id: 'kyc' });

    } catch (error) {
      console.error(error);
      toast.error('Failed to submit application. Please try again.', { id: 'kyc' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 mb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Verification</h1>
        <p className="text-slate-500 font-medium mt-1">Complete your KYC to unlock wholesale selling capabilities.</p>
      </div>

      {isRejected && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-start gap-4">
           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
             <AlertCircle size={24} />
           </div>
           <div>
              <h3 className="text-lg font-black text-red-900 mb-1">Application Rejected</h3>
              <p className="text-red-700 text-sm font-medium">Your previous application was rejected by the admin. Please verify your details and upload a clearer ID document before re-submitting.</p>
           </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />
          <h3 className="text-xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-3">
             <Landmark className="text-emerald-500" /> Farm / Business Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Farm or Business Name *</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="text" value={formData.farmName} onChange={e => setFormData({...formData, farmName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" placeholder="e.g. Green Valley Farms" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Owner's Legal Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="text" value={formData.legalName} onChange={e => setFormData({...formData, legalName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" placeholder="As per Govt ID" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Postal Pincode *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" placeholder="123456" />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Complete Address *</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                <textarea required rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900" placeholder="Full legal/operating address..." />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
          <h3 className="text-xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-3">
             <ShieldCheck className="text-emerald-500" /> Identity Verification
          </h3>
          
          <div className="relative z-10 space-y-4">
             <p className="text-sm font-medium text-slate-500 mb-4">Please upload a clear picture of your Government-issued ID (Aadhar, PAN, Voter ID) or a valid Farm/Business License.</p>
             
             <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-emerald-400 transition-colors group bg-slate-50/50">
               <input 
                 type="file" 
                 accept="image/*,.pdf" 
                 id="idUpload"
                 className="hidden" 
                 onChange={handleFileChange}
               />
               <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center">
                 {idPreview ? (
                   <div className="relative w-48 h-32 mb-4 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                      <img src={idPreview} alt="ID Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white text-[10px] font-black uppercase tracking-widest">Change File</span>
                      </div>
                   </div>
                 ) : (
                   <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-sm group-hover:scale-110 group-hover:text-emerald-500 transition-all">
                      <Upload size={32} />
                   </div>
                 )}
                 <span className="text-sm font-black text-slate-900">{idPreview ? idFile.name : 'Click to upload Govt. ID'}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">Max 5MB (JPG, PNG, PDF)</span>
               </label>
             </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 text-white rounded-[2rem] py-5 font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
          {loading ? 'Submitting Application...' : 'Submit Verification'}
        </button>
      </form>
    </div>
  );
};

export default FarmerVerification;
// Force Vite HMR reload
