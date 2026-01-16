'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { getComplaints, updateComplaintStatus } from '@/lib/api';

export default function DSComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setError('');
      const data = await getComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
      setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: newStatus } : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;

  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-red-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Complaints</h1>
          <p className="text-sm text-gray-600">Track complaints, resolution status, follow-up</p>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600">No complaints found</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Citizen</th>
                <th className="px-4 py-3 text-left font-semibold">Complaint</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.citizen_name}</td>
                  <td className="px-4 py-3 text-gray-700">{c.complaint_text}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(c.created_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)} className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer ${c.status === 'Open' ? 'bg-red-100 text-red-700' : c.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-3"><button className="text-blue-600 hover:text-blue-800"><MessageCircle size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
