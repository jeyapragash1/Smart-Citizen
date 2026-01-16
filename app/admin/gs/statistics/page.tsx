'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getGSStats } from '@/lib/api';

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getGSStats();
        setStats(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load statistics');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-blue-600 mr-3" size={32} />
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
        {error || 'No statistics available'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Statistics & Analytics</h1>
          <p className="text-gray-600 text-sm mt-1">Performance metrics and division analytics</p>
        </div>
        <select 
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none shadow-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Applications Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Total Applications</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.applications?.total ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.applications?.approved ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.applications?.pending ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.applications?.rejected ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Approval Rate</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.applications?.rate ?? '0%'}</p>
          </div>
        </div>
      </div>

      {/* Villagers Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Villager Database</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Total Registered</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.villagers_block?.total ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.villagers_block?.active ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Inactive</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{stats.villagers_block?.inactive ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">New This Month</p>
            <p className="text-3xl font-bold text-teal-600 mt-2">{stats.villagers_block?.newThisMonth ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Disputes & Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disputes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Land Disputes</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-700">Total Disputes</span>
              <span className="text-2xl font-bold text-gray-900">{stats.disputes_block?.total ?? 0}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-700">Currently Open</span>
              <span className="text-2xl font-bold text-red-600">{stats.disputes_block?.open ?? 0}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-700">Resolved</span>
              <span className="text-2xl font-bold text-green-600">{stats.disputes_block?.resolved ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Avg. Resolution Time</span>
              <span className="text-2xl font-bold text-blue-600">{stats.disputes_block?.avgResolutionDays ?? 0}d</span>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Certificates Issued</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-700">Total Issued</span>
              <span className="text-2xl font-bold text-gray-900">{stats.certificates.issued}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-700">Pending Signature</span>
              <span className="text-2xl font-bold text-yellow-600">{stats.certificates.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Issued This Month</span>
              <span className="text-2xl font-bold text-green-600">{stats.certificates.thisMonth}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.performance.avgProcessingTime}</div>
            <p className="text-gray-600">Avg. Processing Time</p>
            <div className="mt-3 inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
              ↓ 8% from last month
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.performance.satisfactionRate}</div>
            <p className="text-gray-600">Citizen Satisfaction</p>
            <div className="mt-3 inline-block px-4 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
              ↑ 3% from last month
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats.performance.completionRate}</div>
            <p className="text-gray-600">Overall Completion Rate</p>
            <div className="mt-3 inline-block px-4 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
              ↑ 2% from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
