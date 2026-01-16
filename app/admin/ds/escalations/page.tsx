'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { getEscalations } from '@/lib/api';

export default function DSEscalationsPage() {
  const [escalations, setEscalations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEscalations();
  }, []);

  const fetchEscalations = async () => {
    try {
      setError('');
      const data = await getEscalations();
      setEscalations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load escalations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-red-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Escalations</h1>
          <p className="text-sm text-gray-600">Track escalated cases and pending resolutions</p>
        </div>
      </div>

      {escalations.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600">No escalations</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Escalation ID</th>
                <th className="px-4 py-3 text-left font-semibold">Citizen</th>
                <th className="px-4 py-3 text-left font-semibold">Reason</th>
                <th className="px-4 py-3 text-left font-semibold">Level</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {escalations.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{e.id}</td>
                  <td className="px-4 py-3">{e.citizen}</td>
                  <td className="px-4 py-3 text-gray-700">{e.reason}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">{e.escalation_level}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${e.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
