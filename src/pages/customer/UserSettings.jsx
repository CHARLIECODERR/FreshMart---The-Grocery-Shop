import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import { updatePassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// New Sub-components
import ProfileTab from '../../components/user/settings/ProfileTab';
import NotificationsTab from '../../components/user/settings/NotificationsTab';
import SecurityTab from '../../components/user/settings/SecurityTab';

const UserSettings = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    phoneNumber: userData?.phoneNumber || '',
    bio: userData?.bio || '',
    photoURL: currentUser?.photoURL || ''
  });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  const [notifs, setNotifs] = useState({
    orderUpdates: userData?.notifications?.orderUpdates ?? true,
    newProducts: userData?.notifications?.newProducts ?? true,
    promotions: userData?.notifications?.promotions ?? false,
    smsAlerts: userData?.notifications?.smsAlerts ?? false
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('File too large. Max 2MB.');

    try {
      setUploading(true);
      const storageRef = ref(storage, `avatars/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(currentUser, { photoURL: downloadURL });
      await updateDoc(doc(db, 'users', currentUser.uid), { photoURL: downloadURL });
      setProfileData(prev => ({ ...prev, photoURL: downloadURL }));
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: profileData.displayName,
        phoneNumber: profileData.phoneNumber,
        bio: profileData.bio
      });
      await updateProfile(currentUser, { displayName: profileData.displayName });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match');
    try {
      setLoading(true);
      await updatePassword(currentUser, passwords.new);
      toast.success('Password updated!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotif = async (key) => {
    const newVal = !notifs[key];
    setNotifs(prev => ({ ...prev, [key]: newVal }));
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { [`notifications.${key}`]: newVal });
    } catch (error) {
      toast.error('Preference failed to save');
    }
  };

  const sendTestNotification = async () => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: currentUser.uid,
        title: 'System Test',
        message: 'Your notification system is now workable! 🚀',
        type: 'info',
        read: false,
        createdAt: serverTimestamp()
      });
      toast.success('Test notification sent!');
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate('/account')} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="ml-auto"><ChevronRight size={16} /></motion.div>}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <ProfileTab 
                profileData={profileData}
                setProfileData={setProfileData}
                handleProfileUpdate={handleProfileUpdate}
                handleImageUpload={handleImageUpload}
                uploading={uploading}
                loading={loading}
                currentUser={currentUser}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsTab 
                notifs={notifs}
                toggleNotif={toggleNotif}
                sendTestNotification={sendTestNotification}
              />
            )}
            {activeTab === 'security' && (
              <SecurityTab 
                passwords={passwords}
                setPasswords={setPasswords}
                handlePasswordUpdate={handlePasswordUpdate}
                showPass={showPass}
                setShowPass={setShowPass}
                loading={loading}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
