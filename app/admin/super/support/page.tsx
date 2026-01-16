'use client';

import React, { useEffect, useState } from 'react';
import { Headset, MessageSquare, UserCheck, Loader2, AlertCircle } from 'lucide-react';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTickets() {
      try {
        setError('');
        // TODO: Hook to /api/support/tickets when backend endpoint is ready
        setTickets([]);
      } catch (err: any) {
        setError(err.message || 'Failed to load support tickets');
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <AlertCircle size={16} /> {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Desk</h1>
          <p className="text-sm text-gray-600">Track and triage support tickets across roles</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
          <Headset size={14} /> Live queue
        </span>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Ticket</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Subject</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{t.id}</td>
                <td className="px-4 py-3 text-gray-700">{t.type}</td>
                <td className="px-4 py-3 text-gray-700">{t.subject}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{t.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold mb-2"><MessageSquare size={18} /> Quick note to ops</div>
        <textarea className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full" rows={3} placeholder="Leave an internal note" />
        <div className="mt-3 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Submit note</button>
        </div>
      </div>
    </div>
  );
}
