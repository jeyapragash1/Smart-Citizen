'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Eye, RefreshCw, AlertCircle, Search, Filter, Zap, Loader2 } from 'lucide-react';
import { getUserPermits } from '@/lib/api';

export default function PermitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [permits, setPermits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermits() {
      try {
        setLoading(true);
        const data = await getUserPermits();
        setPermits(data || []);
      } catch (err) {
        console.error(err);
        setPermits([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPermits();
  }, []);

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = permit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || permit.status.includes(filterStatus);
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    if (status.includes('✅')) return 'bg-green-100 text-green-700 border-green-300';
    if (status.includes('⚠️')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (status.includes('❌')) return 'bg-red-100 text-red-700 border-red-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📑 Permits & Licenses</h1>
          <p className="text-gray-600 mt-1">Manage your permits and licenses</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search permits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            title="Filter permits by status"
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
          >
            <option value="all">All Status</option>
            <option value="✅">Active</option>
            <option value="⚠️">Expiring Soon</option>
            <option value="❌">Expired</option>
          </select>
        </div>
      </div>

      {/* Permits Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <Loader2 size={48} className="mx-auto mb-4 text-blue-500 animate-spin" />
            <p className="text-gray-500 text-lg font-semibold">Loading your permits...</p>
          </div>
        ) : filteredPermits.length > 0 ? (
          filteredPermits.map((permit) => (
            <div key={permit.id || permit._id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row">
                {/* Left Section */}
                <div className="flex-1 p-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex gap-4">
                    <div className="text-5xl">{permit.icon || '📄'}</div>
                    <div className="flex-1">
                      <h3 className="font-black text-gray-900 text-lg">{permit.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">License #: <span className="font-mono font-bold text-gray-900">{permit.number || 'N/A'}</span></p>
                      <p className="text-sm text-gray-600 mt-1">Issued by: <span className="font-semibold">{permit.issuer || 'Government Authority'}</span></p>

                      <div className="flex gap-3 mt-3 flex-wrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(permit.status || '✅ Active')}`}>
                          {permit.status || '✅ Active'}
                        </span>
                        {permit.daysLeft > 0 && permit.daysLeft <= 90 && (
                          <span className="inline-flex px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold border border-orange-300 items-center gap-1">
                            <AlertCircle size={12} /> {permit.daysLeft} days left
                          </span>
                        )}
                        {permit.daysLeft < 0 && (
                          <span className="inline-flex px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold border border-red-300">
                            Expired {Math.abs(permit.daysLeft)} days ago
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Dates & Actions */}
                <div className="p-6 md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
                  <div className="space-y-3 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Issued</p>
                      <p className="text-sm font-bold text-gray-900">{permit.date || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Expires</p>
                      <p className={`text-sm font-bold ${permit.daysLeft < 0 ? 'text-red-600' : permit.daysLeft <= 90 ? 'text-orange-600' : 'text-green-600'}`}>
                        {permit.expiry || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-bold text-sm">
                      <Eye size={16} /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition font-bold text-sm">
                      <Download size={16} /> Download
                    </button>
                    {permit.daysLeft < 0 && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition font-bold text-sm">
                        <RefreshCw size={16} /> Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <Zap size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-semibold">No permits found</p>
            <p className="text-gray-400 mt-1">You don't have any permits yet</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 text-center">
          <p className="text-3xl font-black text-green-600">{permits.filter(p => p.status && p.status.includes('✅')).length}</p>
          <p className="text-sm text-gray-600 mt-2">Active</p>
        </div>
        <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6 text-center">
          <p className="text-3xl font-black text-yellow-600">{permits.filter(p => p.status && p.status.includes('⚠️')).length}</p>
          <p className="text-sm text-gray-600 mt-2">Expiring Soon</p>
        </div>
        <div className="bg-linear-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-200 p-6 text-center">
          <p className="text-3xl font-black text-red-600">{permits.filter(p => p.status && p.status.includes('❌')).length}</p>
          <p className="text-sm text-gray-600 mt-2">Expired</p>
        </div>
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 text-center">
          <p className="text-3xl font-black text-blue-600">{permits.length}</p>
          <p className="text-sm text-gray-600 mt-2">Total Permits</p>
        </div>
      </div>

      {/* Alert for Expiring Permits */}
      {permits.some(p => p.daysLeft > 0 && p.daysLeft <= 90) && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 flex gap-4">
          <AlertCircle className="text-yellow-600 shrink-0" size={24} />
          <div>
            <h4 className="font-black text-yellow-900 mb-1">Action Required</h4>
            <p className="text-sm text-yellow-800">You have permits expiring within 90 days. Please renew them to avoid service interruption.</p>
          </div>
        </div>
      )}
    </div>
  );
}
