'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Loader2, AlertCircle } from 'lucide-react';
import { getDSNotifications, markNotificationAsRead } from '@/lib/api';

export default function DSNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setError('');
      const data = await getDSNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await markNotificationAsRead(notifId);
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification');
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;

  const mockNotifications = [
    { id: '1', type: 'Pending', title: '15 applications pending DS approval', date: '2 min ago', read: false },
    { id: '2', type: 'Alert', title: 'GS Officer performance below threshold', date: '1 hour ago', read: false },
    { id: '3', type: 'Info', title: 'Weekly report generated successfully', date: '5 hours ago', read: true },
    { id: '4', type: 'Warning', title: 'SLA breach: 3 applications overdue', date: '1 day ago', read: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="text-yellow-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Notifications</h1>
          <p className="text-sm text-gray-600">Alerts, reminders, and system updates</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
      
      {notifications.length === 0 && !error ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600">No notifications</div>
      ) : (
        <div className="space-y-3">
          {(notifications.length > 0 ? notifications : mockNotifications).map(n => (
            <div key={n.id} className={`border rounded-lg p-4 flex items-start justify-between ${n.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${n.type === 'Pending' ? 'bg-yellow-100 text-yellow-700' : n.type === 'Alert' ? 'bg-red-100 text-red-700' : n.type === 'Warning' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {n.type}
                  </span>
                  {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                </div>
                <p className="font-medium text-gray-900 mt-2">{n.title}</p>
                <p className="text-xs text-gray-500 mt-1">{n.date}</p>
              </div>
              <button onClick={() => handleMarkAsRead(n.id)} className="p-2 hover:bg-gray-200 rounded-lg">
                <Check size={16} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
