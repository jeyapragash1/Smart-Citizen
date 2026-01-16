'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { getPerformanceMetrics } from '@/lib/api';

export default function DSPerformancePage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setError('');
      const data = await getPerformanceMetrics();
      setMetrics(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GS Officer Performance</h1>
          <p className="text-sm text-gray-600">Track metrics, approval rates, satisfaction scores</p>
        </div>
      </div>

      {metrics.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600">No performance data available</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Officer Name</th>
                <th className="px-4 py-3 text-left font-semibold">GS Section</th>
                <th className="px-4 py-3 text-center font-semibold">Approved</th>
                <th className="px-4 py-3 text-center font-semibold">Rejected</th>
                <th className="px-4 py-3 text-center font-semibold">Approval Rate</th>
                <th className="px-4 py-3 text-center font-semibold">Avg Time</th>
                <th className="px-4 py-3 text-center font-semibold">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {metrics.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-gray-700">{m.gs_section}</td>
                  <td className="px-4 py-3 text-center"><span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full">{m.approved_count}</span></td>
                  <td className="px-4 py-3 text-center"><span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full">{m.rejected_count}</span></td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">{m.approval_rate}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{m.avg_processing_time}</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-semibold">{m.satisfaction_rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
