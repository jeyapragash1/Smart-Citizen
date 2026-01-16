'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { getRegionalReports } from '@/lib/api';

export default function DSReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      const result = await getRegionalReports();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Divisional Analytics - {data?.division}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">GS Sections</p>
          <p className="text-3xl font-bold mt-2">{data?.total_gs_sections}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Total Applications</p>
          <p className="text-3xl font-bold mt-2">{data?.total_applications}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Completion Rate</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{data?.completion_rate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><BarChart size={18}/> Service Requests per Section</h3>
            <div className="space-y-3">
              {data?.sections?.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(s.applications / data.total_applications) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{s.applications}</span>
                </div>
              ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><TrendingUp size={18}/> Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Avg Processing Time</span>
                <span className="font-semibold">{data?.average_processing_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Completion Rate</span>
                <span className="font-semibold text-green-600">{data?.completion_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Applications</span>
                <span className="font-semibold">{data?.total_applications}</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}