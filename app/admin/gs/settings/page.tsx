'use client';

import React, { useEffect, useState } from 'react';
import { Save, Eye, EyeOff, Bell, Lock, User, Sliders, Loader2 } from 'lucide-react';
import { getGSSettings, updateGSSettings } from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getGSSettings();
        setSettings(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      profile: { ...settings.profile, [field]: value }
    });
    setHasChanges(true);
  };

  const handleNotificationChange = (field: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: !settings.notifications[field as keyof typeof settings.notifications]
      }
    });
    setHasChanges(true);
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      preferences: { ...settings.preferences, [field]: value }
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    const persist = async () => {
      try {
        await updateGSSettings({
          phone: settings?.profile?.phone,
          address: settings?.profile?.address,
          language: settings?.preferences?.language,
          dateFormat: settings?.preferences?.dateFormat,
          timeFormat: settings?.preferences?.timeFormat,
          theme: settings?.preferences?.theme
        });
        setHasChanges(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to save settings');
      }
    };
    persist();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-blue-600 mr-3" size={32} />
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
        {error || 'No settings available'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Settings</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your account and preferences</p>
        </div>
        {hasChanges && (
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-l-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User size={20} /> Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'notifications'
                  ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-l-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell size={20} /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'security'
                  ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-l-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lock size={20} /> Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'preferences'
                  ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-l-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Sliders size={20} /> Preferences
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={settings.profile.name}
                  onChange={e => handleProfileChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={settings.profile.email}
                  onChange={e => handleProfileChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={settings.profile.phone}
                  onChange={e => handleProfileChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
                <input 
                  type="text" 
                  value={settings.profile.division}
                  onChange={e => handleProfileChange('division', e.target.value)}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea 
                  value={settings.profile.address}
                  onChange={e => handleProfileChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive urgent alerts via SMS' },
                  { key: 'appNotifications', label: 'App Notifications', desc: 'In-app notification alerts' },
                  { key: 'dailyReport', label: 'Daily Report', desc: 'Receive daily summary report' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly summary report' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.key)}
                      className={`relative w-14 h-8 rounded-full transition ${
                        settings.notifications[item.key as keyof typeof settings.notifications]
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                        settings.notifications[item.key as keyof typeof settings.notifications]
                          ? 'right-1'
                          : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
              
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-bold text-red-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-blue-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-700 mt-1">Add an extra layer of security</p>
                  </div>
                  <button className={`relative w-14 h-8 rounded-full transition ${
                    settings.security.twoFactor ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                      settings.security.twoFactor ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preference Settings */}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">General Preferences</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select 
                  value={settings.preferences.language}
                  onChange={e => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>English</option>
                  <option>Sinhala</option>
                  <option>Tamil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select 
                  value={settings.preferences.dateFormat}
                  onChange={e => handlePreferenceChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>DD-MM-YYYY</option>
                  <option>MM-DD-YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                <select 
                  value={settings.preferences.timeFormat}
                  onChange={e => handlePreferenceChange('timeFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>24hr</option>
                  <option>12hr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select 
                  value={settings.preferences.theme}
                  onChange={e => handlePreferenceChange('theme', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
