'use client';

import React, { useState } from 'react';
import { Save, Settings } from 'lucide-react';

export default function DSSettingsPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setMessage('Settings saved (placeholder). Wire to backend when available.');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DS Settings</h1>
          <p className="text-sm text-gray-600">Contact details and notification preferences</p>
        </div>
      </div>

      {message && <div className="p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded-lg">{message}</div>}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          disabled={loading}
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 disabled:opacity-60"
        >
          <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
