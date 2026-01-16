'use client';

import React, { useState } from 'react';
import { Bell, Lock, Globe, Shield, Save, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    sms: true,
    email: true,
    language: 'en'
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

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    showNotification('success', 'Settings saved successfully!');
  };

  return (
    <div className="max-w-3xl">
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        
        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell size={18} className="text-orange-500"/> Notifications
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">SMS Alerts</p>
                        <p className="text-xs text-gray-500">Receive application status updates via SMS.</p>
                    </div>
                    <button 
                        onClick={() => toggleSetting('sms')}
                        className={`w-11 h-6 rounded-full transition-colors relative ${settings.sms ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.sms ? 'translate-x-5' : ''}`}></span>
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500">Get newsletters and smart suggestions.</p>
                    </div>
                    <button 
                        onClick={() => toggleSetting('email')}
                        className={`w-11 h-6 rounded-full transition-colors relative ${settings.email ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.email ? 'translate-x-5' : ''}`}></span>
                    </button>
                </div>
            </div>
        </div>

        {/* Language */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe size={18} className="text-blue-500"/> Language Preference
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {['en', 'si', 'ta'].map(lang => (
                    <button 
                        key={lang}
                        onClick={() => setSettings({...settings, language: lang})}
                        className={`border py-2 rounded-lg font-bold uppercase ${settings.language === lang ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        {lang === 'en' ? 'English' : lang === 'si' ? 'සිංහල' : 'தமிழ்'}
                    </button>
                ))}
            </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-green-600"/> Security
            </h3>
            <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <span className="text-gray-700">Change Password</span>
                    <Lock size={16} className="text-gray-400"/>
                </button>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-gray-700">Two-Factor Authentication (2FA)</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Enabled</span>
                </div>
            </div>
        </div>

        <div className="flex justify-end">
            <button onClick={handleSave} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 flex items-center gap-2">
                <Save size={18} /> Save Preferences
            </button>
        </div>

      </div>
    </div>
  );
}