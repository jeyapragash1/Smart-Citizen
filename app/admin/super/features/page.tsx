'use client';

import React, { useEffect, useState } from 'react';
import { ToggleLeft, ToggleRight, Flag, Loader2, AlertCircle } from 'lucide-react';

export default function FeaturesPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFlags() {
      try {
        setError('');
        // TODO: Hook to /api/feature-flags when backend endpoint is ready
        setFlags([]);
      } catch (err: any) {
        setError(err.message || 'Failed to load feature flags');
      } finally {
        setLoading(false);
      }
    }
    loadFlags();
  }, []);

  const toggle = (key: string) => {
    setFlags((prev) => prev.map((f) => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Feature Flags</h1>
          <p className="text-sm text-gray-600">Safely roll out features and experiments</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
          <Flag size={14} /> Controlled rollout
        </span>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {flags.map((flag) => (
          <div key={flag.key} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <p className="font-semibold text-gray-900">{flag.name}</p>
              <p className="text-sm text-gray-600">{flag.desc}</p>
            </div>
            <button
              onClick={() => toggle(flag.key)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 hover:bg-gray-100"
            >
              {flag.enabled ? <ToggleRight size={18} className="text-emerald-600" /> : <ToggleLeft size={18} className="text-gray-400" />}
              {flag.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
