'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { getAuditLogs } from '@/lib/api';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        setError('');
        const data = await getAuditLogs();
        setLogs(Array.isArray(data) ? data : data.logs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load audit logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
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
          <h1 className="text-2xl font-bold text-gray-900">Audit & Compliance</h1>
          <p className="text-sm text-gray-600">Access trails, changes, and compliance checkpoints</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
          <ShieldCheck size={14} /> Audit trail active
        </span>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800 font-semibold"><FileText size={18} /> Recent audit events</div>
          <AlertTriangle size={16} className="text-amber-600" />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Time</th>
              <th className="px-4 py-3 text-left font-semibold">Actor</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
              <th className="px-4 py-3 text-left font-semibold">Target</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.time} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700 font-mono text-xs">{log.time}</td>
                <td className="px-4 py-3 text-gray-800">{log.actor}</td>
                <td className="px-4 py-3 text-gray-800">{log.action}</td>
                <td className="px-4 py-3 text-gray-800">{log.target}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
