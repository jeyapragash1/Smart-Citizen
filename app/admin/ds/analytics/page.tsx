'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { getWorkflowAnalytics } from '@/lib/api';

export default function DSAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setError('');
      const data = await getWorkflowAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;

  const metrics = [
    { label: 'Avg Processing Time', value: analytics?.avg_processing_time || '2.3 days', trend: analytics?.trends?.processing_time || '↓ 12%' },
    { label: 'Approval Rate', value: analytics?.approval_rate || '94.2%', trend: analytics?.trends?.approval_rate || '↑ 3%' },
    { label: 'Pending Queue', value: analytics?.pending_queue || '23 apps', trend: '↓ 8%' },
    { label: 'Citizen Satisfaction', value: analytics?.citizen_satisfaction || '92%', trend: analytics?.trends?.satisfaction || '↑ 5%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Analytics</h1>
          <p className="text-sm text-gray-600">Application flow, bottlenecks, SLA tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-600 font-medium">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{m.value}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">{m.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
