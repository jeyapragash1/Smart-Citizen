'use client';

import React, { useEffect, useState } from 'react';
import { Archive, Loader2, Search, Download, Eye, Calendar } from 'lucide-react';
import { getGSRecords } from '@/lib/api';

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getGSRecords();
        setRecords(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load records');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredRecords = records.filter(rec => {
    const title = (rec.title || '').toLowerCase();
    const villager = (rec.villager || '').toLowerCase();
    const type = (rec.type || '').toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || villager.includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || type === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const recordTypes = [...new Set(records.map(r => r.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📦 Records & Archives</h1>
        <p className="text-gray-600 text-sm mt-1">Access historical records and archived documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Records</p>
          <p className="text-3xl font-bold text-blue-600">{records.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Applications</p>
          <p className="text-3xl font-bold text-purple-600">{records.filter(r => r.type === 'Application').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Disputes</p>
          <p className="text-3xl font-bold text-red-600">{records.filter(r => r.type === 'Dispute').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
          <p className="text-gray-600 text-sm font-medium mb-2">Certificates</p>
          <p className="text-3xl font-bold text-green-600">{records.filter(r => r.type === 'Certificate').length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search records by title or villager..." 
            className="bg-transparent w-full outline-none text-gray-900"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none"
        >
          <option value="all">All Types</option>
          {recordTypes.map(type => (
            <option key={type} value={type.toLowerCase()}>{type}</option>
          ))}
        </select>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-200">{error}</div>
        )}
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-3" size={32} />
            <p className="text-gray-600">Loading records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Archive size={48} className="mx-auto mb-3 opacity-30" />
            <p>No records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Record Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Related Villager</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{rec.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{rec.villager}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                      <Calendar size={14} /> {rec.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg text-green-600">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
