'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Copy,
  X
} from 'lucide-react';
import { getMyApplications, downloadCertificate, deleteApplication } from '@/lib/api';
import ApprovalInterface from '@/components/ApprovalInterface';

// Define the shape of our data
interface Application {
  _id: string;
  service_type: string;
  status: string;
  created_at: string;
  approval_level?: string;
  current_approval_stage?: string;
  approval_chain?: Array<{
    level: string;
    nic: string;
    action: string;
    timestamp: string;
    comments: string;
  }>;
  details: {
    name: string;
    phone: string;
    address?: string;
    reason?: string;
  };
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Show notification function
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' });
    }, 3000);
  };

  // 1. Fetch Real Data
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMyApplications();
      // Sort by newest first
      setApplications(data.reverse());
    } catch (err) {
      console.error(err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Handle Delete (Withdraw)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) return;
    
    try {
      // Assuming backend has DELETE /api/applications/{id}
      // If not, you might need to add that route to backend first.
      await deleteApplication(id); 
      showNotification('success', 'Application withdrawn successfully');
      loadData(); // Refresh list
    } catch (err) {
      showNotification('error', 'Could not delete. The application might already be processed');
    }
  };

  // 3. Helper: Copy ID
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'Reference ID copied to clipboard!');
  };

  // 4. Helper: Status Badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed': 
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"><CheckCircle size={12}/> Approved</span>;
      case 'Pending': 
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold"><Clock size={12}/> Pending Review</span>;
      case 'Rejected': 
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold"><XCircle size={12}/> Rejected</span>;
      default: 
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold"><AlertCircle size={12}/> {status}</span>;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
            notification.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle size={24} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={24} className="flex-shrink-0" />
            )}
            <div>
              <p className="font-semibold">
                {notification.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-4 hover:bg-white/20 p-1 rounded transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <button 
            onClick={() => router.push('/services')} 
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition flex items-center gap-2 shadow-sm"
        >
            <FileText size={18} /> New Application
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search by Reference ID or Service Name..." className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <Filter size={16} /> Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[300px]">
        
        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 size={32} className="animate-spin mb-2 text-blue-600" />
                <p>Loading your history...</p>
            </div>
        )}

        {/* Error State */}
        {!loading && error && (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <AlertCircle size={32} className="mb-2" />
                <p>{error}</p>
            </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>No applications found.</p>
                <button onClick={() => router.push('/services')} className="mt-4 text-blue-600 font-medium hover:underline">Apply for your first service</button>
            </div>
        )}

        {/* Real Data Table */}
        {!loading && applications.length > 0 && (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Reference ID</th>
                            <th className="px-6 py-4 font-semibold">Service Name</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50 transition">
                                {/* Full Reference ID with Copy */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 group">
                                        <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{app._id}</span>
                                        <button onClick={() => copyToClipboard(app._id)} className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 font-medium text-gray-900">{app.service_type}</td>
                                
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </td>
                                
                                <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* View Details */}
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="View Details"
                                        >
                                            <Eye size={18}/>
                                        </button>

                                        {/* Delete (Only if Pending) */}
                                        {app.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleDelete(app._id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Withdraw Application"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        )}
                                        
                                        {/* Download (Only if Completed) */}
                                        {app.status === 'Completed' && (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        await downloadCertificate(app._id);
                                                        showNotification('success', 'Certificate downloaded successfully!');
                                                    } catch (error) {
                                                        const message = error instanceof Error ? error.message : 'Failed to download certificate';
                                                        showNotification('error', message);
                                                    }
                                                }}
                                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition"
                                                title="Download Certificate"
                                            >
                                                <Download size={18}/>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* =======================
          VIEW DETAILS MODAL
      ======================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedApp.service_type}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">REF: {selectedApp._id}</p>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                        <span className="text-sm text-blue-700 font-medium">Current Status</span>
                        {getStatusBadge(selectedApp.status)}
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
                            <span className="font-medium text-gray-900">{new Date(selectedApp.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col gap-1 pt-2">
                            <span className="text-gray-500">Reason / Description</span>
                            <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {selectedApp.details.reason || "No specific reason provided."}
                            </p>
                        </div>
                    </div>

                    {/* Approval Chain Section */}
                    {selectedApp.approval_chain && selectedApp.approval_chain.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Approval Workflow</h4>
                            <ApprovalInterface 
                                applicationId={selectedApp._id}
                                currentStage={selectedApp.current_approval_stage || 'pending'}
                                approvalChain={selectedApp.approval_chain}
                                onApprove={async () => {
                                    // This would be called by officer reviewing the application
                                    console.log('Approved:', selectedApp._id);
                                }}
                                onReject={async () => {
                                    // This would be called by officer reviewing the application
                                    console.log('Rejected:', selectedApp._id);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 p-4 flex justify-end">
                    <button 
                        onClick={() => setSelectedApp(null)}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}