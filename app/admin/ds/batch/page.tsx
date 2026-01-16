'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getDSQueue, batchApproveApplications } from '@/lib/api';

export default function DSBatchApprovalsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setError('');
      const data = await getDSQueue();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const handleBatchApprove = async () => {
    if (!selected.length) return;
    setLoading(true);
    try {
      const result = await batchApproveApplications(selected);
      setSuccess(`Successfully approved ${result.approved_count} applications`);
      setSelected([]);
      await fetchApplications();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === apps.length ? [] : apps.map(a => a._id));
  };

  if (loading && apps.length === 0) {
    return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Approvals</h1>
          <p className="text-sm text-gray-600">Approve multiple applications at once</p>
        </div>
        <button
          onClick={handleBatchApprove}
          disabled={!selected.length || loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center gap-2"
        >
          <CheckCircle size={16} /> {loading ? 'Processing...' : `Approve (${selected.length})`}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"><CheckCircle size={16} /> {success}</div>}

      {apps.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600">No pending applications</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" onChange={toggleSelectAll} checked={apps.length > 0 && selected.length === apps.length} /></th>
                <th className="px-4 py-3 text-left font-semibold">Applicant</th>
                <th className="px-4 py-3 text-left font-semibold">Service Type</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {apps.map(app => (
                <tr key={app._id} className={`${selected.includes(app._id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(app._id)} onChange={() => toggleSelect(app._id)} /></td>
                  <td className="px-4 py-3 font-medium">{app.fullname || 'Unknown'}</td>
                  <td className="px-4 py-3">{app.service_type || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(app.created_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
