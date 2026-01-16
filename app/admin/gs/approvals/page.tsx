'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Loader2,
  Eye,
  X,
  FileText
} from 'lucide-react';
import ApprovalInterface from '@/components/ApprovalInterface';
import { getAuthHeader, getErrorMessage } from '@/lib/api';

interface ApprovalChainItem {
  level: string;
  nic: string;
  action: string;
  timestamp: string;
  comments: string;
}

interface Application {
  _id: string;
  service_type: string;
  status: string;
  created_at: string;
  approval_level?: string;
  current_approval_stage?: string;
  approval_chain?: ApprovalChainItem[];
  details: {
    name: string;
    phone: string;
    address?: string;
    reason?: string;
  };
}

export default function GSApprovalsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch pending applications for this GS officer
      const res = await fetch('/api/gs/applications/pending', {
        headers: getAuthHeader(),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(getErrorMessage(res.status));
      }

      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Application Approvals</h1>
        <p className="text-sm text-gray-500">Pending applications: {applications.filter(a => a.status?.toLowerCase() === 'pending').length}</p>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 size={32} className="animate-spin mb-2 text-blue-600" />
            <p>Loading applications...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <AlertCircle size={32} className="mb-2" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>No pending applications</p>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Applicant</th>
                  <th className="px-6 py-4 font-semibold">Service Type</th>
                  <th className="px-6 py-4 font-semibold">Submission Date</th>
                  <th className="px-6 py-4 font-semibold">Current Stage</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.details.name}</td>
                    <td className="px-6 py-4 text-gray-600">{app.service_type}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {app.current_approval_stage === 'gs' ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Grama Niladhari</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{app.current_approval_stage || 'Pending'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Review Application</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">REF: {selectedApp._id}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-900"
                title="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Application Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Application Details</h4>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold text-gray-900">{selectedApp.service_type}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Applicant Name</span>
                    <span className="font-medium text-gray-900">{selectedApp.details.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-gray-900">{selectedApp.details.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Submission Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedApp.created_at).toLocaleString()}
                    </span>
                  </div>
                  {selectedApp.details.address && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Address</span>
                      <span className="font-medium text-gray-900">{selectedApp.details.address}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 pt-2">
                    <span className="text-gray-500">Reason / Description</span>
                    <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {selectedApp.details.reason || "No specific reason provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Approval Interface */}
              {selectedApp.approval_chain && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Approval Workflow</h4>
                  <ApprovalInterface
                    applicationId={selectedApp._id}
                    currentStage={selectedApp.current_approval_stage || 'gs'}
                    approvalChain={selectedApp.approval_chain}
                    onApprove={async (comments: string) => {
                      try {
                        const res = await fetch(`/api/applications/${selectedApp._id}/approve`, {
                          method: 'PUT',
                          headers: {
                            ...getAuthHeader(),
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            action: 'Approved',
                            comments,
                          }),
                        });

                        if (!res.ok) throw new Error('Failed to approve');

                        setSelectedApp(null);
                        loadApplications();
                      } catch (err) {
                        console.error('Approval failed:', err);
                      }
                    }}
                    onReject={async (comments: string) => {
                      try {
                        const res = await fetch(`/api/applications/${selectedApp._id}/reject`, {
                          method: 'PUT',
                          headers: {
                            ...getAuthHeader(),
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            action: 'Rejected',
                            comments,
                          }),
                        });

                        if (!res.ok) throw new Error('Failed to reject');

                        setSelectedApp(null);
                        loadApplications();
                      } catch (err) {
                        console.error('Rejection failed:', err);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
