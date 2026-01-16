'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Server, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDeployments() {
      try {
        setError('');
        // TODO: Hook to /api/deployments when backend endpoint is ready
        setDeployments([]);
      } catch (err: any) {
        setError(err.message || 'Failed to load deployments');
      } finally {
        setLoading(false);
      }
    }
    loadDeployments();
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
          <h1 className="text-2xl font-bold text-gray-900">Deployments & CI/CD</h1>
          <p className="text-sm text-gray-600">Track pipeline runs across environments</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
          <CheckCircle size={14} /> Pipelines healthy
        </span>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Activity size={18} /> Recent deployments
          </div>
          <Clock size={16} className="text-gray-400" />
        </div>
        <ul className="divide-y divide-gray-100 text-sm">
          {deployments.map((d) => (
            <li key={d.env} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{d.env}</p>
                <p className="text-xs text-gray-500">{d.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-gray-800">{d.version}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : d.status === 'Running' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {d.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 font-semibold mb-2"><Server size={18} /> Release gates</div>
          <p className="text-sm text-gray-600">Production deploys require two approvals and green smoke tests.</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 font-semibold mb-2"><Clock size={18} /> Maintenance window</div>
          <p className="text-sm text-gray-600">Fridays 23:00 - 00:00 LKT for critical hotfixes.</p>
        </div>
      </div>
    </div>
  );
}
