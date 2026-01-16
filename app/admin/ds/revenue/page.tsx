'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Loader2, BarChart3 } from 'lucide-react';
import { getDSStats } from '@/lib/api';

export default function DSRevenuePage() {
  const [revenue, setRevenue] = useState<number>(0);
  const [approved, setApproved] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getDSStats();
        setRevenue(data?.revenue || 0);
        setApproved(data?.approved || 0);
        setPending(data?.pending || 0);
      } catch (err: any) {
        setError(err?.message || 'Failed to load revenue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600 mt-2">Loading revenue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue & Payments</h1>
          <p className="text-gray-600 text-sm">Track collections linked to issued certificates</p>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600">
            <DollarSign />
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">LKR {Number(revenue || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Estimated at 1500 LKR per approved application</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-green-600">
            <TrendingUp />
            <p className="text-sm font-medium text-gray-600">Approved Certificates</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{approved}</p>
          <p className="text-xs text-gray-500 mt-1">Completed and signed</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-yellow-600">
            <BarChart3 />
            <p className="text-sm font-medium text-gray-600">Pending Queue</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{pending}</p>
          <p className="text-xs text-gray-500 mt-1">Awaiting DS signature</p>
        </div>
      </div>
    </div>
  );
}
