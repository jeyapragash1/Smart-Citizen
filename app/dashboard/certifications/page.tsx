'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Eye, Share2, Star, Award, Search, Loader2 } from 'lucide-react';
import { getUserCertifications } from '@/lib/api';

export default function CertificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCertifications() {
      try {
        setLoading(true);
        const data = await getUserCertifications();
        setCertifications(data || []);
      } catch (err) {
        setError('Failed to load certifications');
        console.error(err);
        setCertifications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCertifications();
  }, []);

  const filteredCertifications = certifications.filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-600" />
        <p>Loading your certifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">🏆 Certifications & Achievements</h1>
          <p className="text-gray-600 mt-1">Your credentials and professional qualifications</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {filteredCertifications.length > 0 ? (
          filteredCertifications.map((cert) => (
            <div key={cert.id || cert._id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row">
                {/* Left - Icon & Details */}
                <div className="flex-1 p-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex gap-4 items-start">
                    <div className="text-5xl">{cert.icon || '🏆'}</div>
                    <div className="flex-1">
                      <h3 className="font-black text-gray-900 text-lg">{cert.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Issued by: <span className="font-semibold">{cert.issuer}</span></p>
                      <p className="text-sm text-gray-700 mt-2">{cert.description || 'Professional certification'}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">
                          {cert.category || 'Certification'}
                        </span>
                        <span className="inline-block px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-bold">
                          {cert.date || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="p-6 flex flex-col gap-3 justify-center md:w-48">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-bold text-sm">
                    <Eye size={18} /> View Details
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition font-bold text-sm">
                    <Download size={18} /> Download
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition font-bold text-sm">
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-semibold">No certifications found</p>
            <p className="text-gray-400 mt-1">You don't have any certifications yet</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6 text-center">
          <p className="text-3xl font-black text-amber-600">{certifications.length}</p>
          <p className="text-sm text-gray-600 mt-2">Total Certifications</p>
        </div>
        <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6 text-center">
          <p className="text-3xl font-black text-purple-600">{certifications.filter(c => c.category === 'Achievement').length}</p>
          <p className="text-sm text-gray-600 mt-2">Achievements</p>
        </div>
        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 text-center">
          <p className="text-3xl font-black text-green-600">{certifications.filter(c => c.category === 'Professional').length}</p>
          <p className="text-sm text-gray-600 mt-2">Professional Licenses</p>
        </div>
      </div>
    </div>
  );
}
