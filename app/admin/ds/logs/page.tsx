'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { getAuditLogs } from '@/lib/api';

export default function DSLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setError('');
      const data = await getAuditLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;

  const mockLogs = [
    { id: '1', action: 'Application Approved', user_name: 'GS Officer A', timestamp: '2025-12-10T14:30:00', details: 'NIC Cert for Anura Perera' },
    { id: '2', action: 'Application Rejected', user_name: 'GS Officer B', timestamp: '2025-12-10T13:15:00', details: 'Missing documents - Land Cert' },
    { id: '3', action: 'Certificate Signed', user_name: 'DS Officer', timestamp: '2025-12-10T12:00:00', details: 'Batch signed 15 certificates' },
    { id: '4', action: 'GS Officer Added', user_name: 'DS Officer', timestamp: '2025-12-09T10:30:00', details: 'New GS Officer assigned to Section 4' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Audit Logs</h1>
          <p className="text-sm text-gray-600">Track all approvals, rejections, and system actions</p>
        </div>
      </div>

      {logs.length === 0 && !error ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600">No audit logs found</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(logs.length > 0 ? logs : mockLogs).map((l, i) => (
                <tr key={l.id || i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{l.action}</td>
                  <td className="px-4 py-3 font-medium">{l.user_name || l.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(l.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-700">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
