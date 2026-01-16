'use client';

import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { getAuditLogs } from '@/lib/api';

export default function AdminLogsPage() {
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
      <AlertCircle size={16} /> {error}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Security Audit Logs</h1>

      {logs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          <AlertTriangle className="mx-auto mb-2" size={32} />
          <p>No audit logs available</p>
        </div>
      ) : (
        <div className="bg-black text-green-400 font-mono text-sm p-6 rounded-xl shadow-lg h-96 overflow-y-auto">
          {logs.map((log: any, idx: number) => {
            const timestamp = new Date(log.timestamp || log.created_at).toLocaleTimeString();
            const level = log.level || log.status || 'INFO';
            const isWarning = level.includes('WARN') || level.includes('WARNING');
            const isError = level.includes('ERROR') || level.includes('CRITICAL');
            
            return (
              <p key={idx} className={`mb-2 ${isError ? 'text-red-500' : isWarning ? 'text-yellow-400' : ''}`}>
                <span className="text-gray-500">[{timestamp}]</span> {log.action || log.message || 'Unknown action'}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}