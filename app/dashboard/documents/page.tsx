'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, Trash2, Search, Filter, FileText, Loader2 } from 'lucide-react';
import { getUserDocuments } from '@/lib/api';

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        const data = await getUserDocuments();
        setDocuments(data || []);
      } catch (err) {
        setError('Failed to load documents');
        console.error(err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-600" />
        <p>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📋 My Documents</h1>
          <p className="text-gray-600 mt-1">Manage and download your digital documents</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            title="Filter documents by type"
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
          >
            <option value="all">All Types</option>
            <option value="Certificate">Certificates</option>
            <option value="ID Card">ID Cards</option>
            <option value="License">Licenses</option>
            <option value="ID Document">ID Documents</option>
            <option value="Property">Property</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div key={doc.id || doc._id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                <div className="text-5xl mb-4">{doc.icon || '📄'}</div>
                <h3 className="font-black text-gray-900 text-lg">{doc.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{doc.type || 'Document'}</p>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Issued Date:</span>
                    <span className="font-semibold text-gray-900">{doc.date || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="font-bold text-sm">{doc.status || '⏳ Processing'}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-bold text-sm">
                    <Eye size={18} /> View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition font-bold text-sm">
                    <Download size={18} /> Download
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-semibold">No documents found</p>
            <p className="text-gray-400 mt-1">You don't have any documents yet</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 text-center">
          <p className="text-3xl font-black text-green-600">{documents.filter(d => d.status.includes('✅')).length}</p>
          <p className="text-sm text-gray-600 mt-2">Verified Documents</p>
        </div>
        <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6 text-center">
          <p className="text-3xl font-black text-yellow-600">{documents.filter(d => d.status.includes('⏳')).length}</p>
          <p className="text-sm text-gray-600 mt-2">Pending Documents</p>
        </div>
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 text-center">
          <p className="text-3xl font-black text-blue-600">{documents.length}</p>
          <p className="text-sm text-gray-600 mt-2">Total Documents</p>
        </div>
      </div>
    </div>
  );
}
