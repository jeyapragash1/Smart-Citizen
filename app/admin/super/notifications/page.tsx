'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Mail, Loader2 } from 'lucide-react';
import { getNotifications, getSubscribers } from '@/lib/api';

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAlerts() {
      try {
        setError('');
        const [notes, subs] = await Promise.all([getNotifications(), getSubscribers()]);
        setAlerts(Array.isArray(notes) ? notes : []);
        setSubscribers(subs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load alerts');
        setAlerts([]);
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <AlertTriangle size={16} /> {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-sm text-gray-600">Broadcast system notices and review operational alerts</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
          <Bell size={14} /> Live feed
        </span>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800 font-semibold"><AlertTriangle size={18} className="text-amber-600" /> Recent alerts</div>
          <CheckCircle size={16} className="text-emerald-500" />
        </div>
        <ul className="divide-y divide-gray-100 text-sm">
          {alerts.map((n) => (
            <li key={n._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-500">To: {n.recipient_email}</div>
                  <div className="text-sm mt-2 text-gray-700">{n.message}</div>
                </div>
                <div className="text-xs text-gray-400">{n.created_at}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold mb-3"><Mail size={18} /> Subscribers ({subscribers.length})</div>
        <p className="text-sm text-gray-600">List of newsletter subscribers</p>
        <ul className="mt-3 divide-y divide-gray-100">
          {subscribers.map(s => (
            <li key={s._id} className="py-2 flex items-center justify-between">
              <div className="text-sm text-gray-800">{s.email}</div>
              <div className="text-xs text-gray-400">{s.subscribed_at}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
