'use client';

import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, MapPin, Save, Camera, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/lib/api';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    fullname: '',
    nic: '',
    email: '',
    phone: '',
    address: ''
  });

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
  };

  // 1. Fetch Profile on Load
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error("Profile load failed", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        email: userData.email,
        phone: userData.phone,
        address: userData.address || "" // Send empty string if undefined
      });
      showNotification('success', 'Profile Updated Successfully!');
    } catch (error) {
      showNotification('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/> Loading Profile...</div>;

  return (
    <div className="max-w-4xl">
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <div>
              <p className="font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 hover:bg-white/20 p-1 rounded transition">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left: Avatar */}
        <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-md">
                        {userData.fullname.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition">
                        <Camera size={14} />
                    </button>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{userData.fullname}</h2>
                <p className="text-sm text-gray-500">Citizen</p>
                <div className="mt-4 pt-4 border-t border-gray-100 text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">NIC Number</p>
                    <p className="font-mono font-medium text-gray-700 bg-gray-50 p-2 rounded">{userData.nic}</p>
                </div>
            </div>
        </div>

        {/* Right: Editable Form */}
        <div className="md:w-2/3">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User size={18} className="text-blue-600"/> Personal Details
                </h3>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Read-Only)</label>
                        <input type="text" value={userData.fullname} disabled className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input 
                                type="email" 
                                value={userData.email} 
                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input 
                                type="tel" 
                                value={userData.phone} 
                                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                            <textarea 
                                rows={3} 
                                value={userData.address} 
                                onChange={(e) => setUserData({...userData, address: e.target.value})}
                                placeholder="Enter your address"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button type="submit" disabled={saving} className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition flex items-center gap-2 disabled:opacity-70">
                            {saving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
}