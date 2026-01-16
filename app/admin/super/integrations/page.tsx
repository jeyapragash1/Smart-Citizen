'use client';

import React, { useEffect, useState } from 'react';
import { Plug, CheckCircle, AlertTriangle, Loader2, AlertCircle as AlertIcon } from 'lucide-react';

export default function IntegrationsPage() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadConnectors() {
      try {
        setError('');
        // TODO: Hook to /api/integrations when backend endpoint is ready
        setConnectors([]);
      } catch (err: any) {
        setError(err.message || 'Failed to load integrations');
      } finally {
        setLoading(false);
      }
    }
    loadConnectors();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
      <AlertIcon size={16} /> {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-600">Third-party and government backbone services</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
          <Plug size={14} /> Live connections
        </span>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Integration</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Notes</th>
              <th className="px-4 py-3 text-left font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {connectors.map((c) => (
              <tr key={c.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Connected' ? 'bg-emerald-100 text-emerald-700' : c.status === 'Degraded' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{c.detail}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
