'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Stamp, FileText, TrendingUp, Loader2, CheckCircle, XCircle, Users, Search, Download, Eye } from 'lucide-react';
import { getDSStats, getDSQueue, getDSCertificates, getGSOfficers } from '@/lib/api';

export default function DSDashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, revenue: 0 });
  const [queue, setQueue] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [gsOfficers, setGsOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [statsRes, queueRes, certRes, gsRes] = await Promise.all([
          getDSStats(),
          getDSQueue(),
          getDSCertificates(),
          getGSOfficers()
        ]);
        setStats(statsRes || { pending: 0, approved: 0, rejected: 0, revenue: 0 });
        setQueue(Array.isArray(queueRes) ? queueRes : []);
        setCerts(Array.isArray(certRes) ? certRes : []);
        setGsOfficers(Array.isArray(gsRes) ? gsRes : []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load DS dashboard');
        setQueue([]);
        setCerts([]);
        setGsOfficers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredQueue = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return queue.filter((item) =>
      (item.applicant_name || '').toLowerCase().includes(term) ||
      (item.service_type || '').toLowerCase().includes(term)
    );
  }, [queue, searchTerm]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600 mt-2">Loading DS dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Divisional Secretariat Overview</h1>
          <p className="text-gray-600 text-sm mt-1">Approve applications, issue certificates, manage GS officers</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-white rounded-xl p-6 shadow-lg">
          <Stamp className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-sm opacity-80 mb-1">Pending Digital Signatures</p>
          <h2 className="text-4xl font-bold">{stats.pending}</h2>
          <p className="text-xs opacity-70 mt-1">Awaiting DS approval</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Certificates Issued</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.approved}</h2>
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
            <FileText size={16} /> Total completed
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Rejected</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{stats.rejected}</h2>
          </div>
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm font-medium">
            <XCircle size={16} /> Need follow-up
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Estimated Revenue</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">LKR {Number(stats.revenue || 0).toLocaleString()}</h2>
          </div>
          <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
            <TrendingUp size={16} /> Verified payments
          </div>
        </div>
      </div>

      {/* Approval Queue */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pending approvals</h2>
            <p className="text-sm text-gray-600">Applications waiting for DS signature</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              className="bg-transparent outline-none text-sm"
              placeholder="Search by applicant or service"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {filteredQueue.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pending applications</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Applicant</th>
                  <th className="px-4 py-3 text-left font-semibold">Service</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQueue.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.applicant_name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-700">{item.service_type || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">{item.status || 'Pending'}</span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100" title="Approve"><CheckCircle size={16} /></button>
                      <button className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100" title="Reject"><XCircle size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issued Certificates */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Issued certificates</h2>
            <p className="text-sm text-gray-600">Completed applications</p>
          </div>
          <div className="text-sm text-gray-500">Total: {certs.length}</div>
        </div>
        {certs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No certificates issued yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Applicant</th>
                  <th className="px-4 py-3 text-left font-semibold">Service</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certs.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.applicant_name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-700">{item.service_type || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">{item.status || 'Completed'}</span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100" title="View"><Eye size={16} /></button>
                      <button className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100" title="Download"><Download size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* GS Officers */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">GS officers in division</h2>
            <p className="text-sm text-gray-600">Reporting to this DS</p>
          </div>
          <div className="text-sm text-gray-500">Total: {gsOfficers.length}</div>
        </div>
        {gsOfficers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No GS officers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">NIC</th>
                  <th className="px-4 py-3 text-left font-semibold">Section</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gsOfficers.map((gs) => (
                  <tr key={gs.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{gs.fullname}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{gs.nic}</td>
                    <td className="px-4 py-3 text-gray-700">{gs.gs_section || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">{gs.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">{gs.email || 'N/A'}</td>
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