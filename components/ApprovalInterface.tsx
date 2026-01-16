'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface ApprovalChainItem {
  level: string;
  nic: string;
  action: string;
  timestamp: string;
  comments: string;
}

interface ApprovalInterfaceProps {
  applicationId: string;
  currentStage: string;
  approvalChain: ApprovalChainItem[];
  onApprove: (comments: string) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

export default function ApprovalInterface({
  applicationId,
  currentStage,
  approvalChain,
  onApprove,
  onReject,
}: ApprovalInterfaceProps) {
  const [approveMode, setApproveMode] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApprove = async () => {
    try {
      setLoading(true);
      setError('');
      await onApprove(comments.trim() || 'Approved');
      setSuccess('Application approved successfully!');
      setComments('');
      setApproveMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to approve application');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setLoading(true);
      await onReject(comments);
      setSuccess('Application rejected successfully');
      setComments('');
      setRejectMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reject application');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'gs':
        return 'bg-blue-50 border-blue-200';
      case 'ds':
        return 'bg-purple-50 border-purple-200';
      case 'district':
        return 'bg-orange-50 border-orange-200';
      case 'ministry':
        return 'bg-red-50 border-red-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'gs':
        return 'Grama Niladhari (Village Officer)';
      case 'ds':
        return 'Divisional Secretary';
      case 'district':
        return 'District Officer';
      case 'ministry':
        return 'Ministry/National Level';
      case 'completed':
        return 'Completed';
      default:
        return stage;
    }
  };

  return (
    <div className="space-y-6">
      {/* Approval Chain Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Approval Timeline</h3>

        {approvalChain.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No approvals yet. This application is pending at {getStageName(currentStage)}.</p>
        ) : (
          <div className="space-y-4">
            {approvalChain.map((item, idx) => (
              <div key={idx} className={`border-l-4 pl-4 py-3 rounded ${item.action === 'Approved' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  {item.action === 'Approved' ? (
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  ) : (
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {item.action} by {getStageName(item.level)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Officer NIC: {item.nic}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(item.timestamp).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {item.comments && (
                      <p className="text-sm text-slate-700 mt-2 italic">
                        "{item.comments}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Stage */}
      {currentStage !== 'completed' && (
        <div className={`border-2 rounded-xl p-6 ${getStageColor(currentStage)}`}>
          <p className="text-sm font-semibold text-slate-700 mb-2">CURRENTLY PENDING AT</p>
          <h3 className="text-2xl font-bold text-slate-900">{getStageName(currentStage)}</h3>
        </div>
      )}

      {/* Approval Buttons */}
      {currentStage !== 'completed' && (
        <>
          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Approve Mode */}
          {approveMode ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500">
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ThumbsUp className="text-green-600" />
                Approve Application
              </h4>
              <p className="text-slate-600 mb-4">
                You are about to approve this application for the next stage.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Add Comments or Remarks
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g., Documents verified. Birth registered in hospital records."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  {loading ? 'Approving...' : 'Confirm Approval'}
                </button>
                <button
                  onClick={() => {
                    setApproveMode(false);
                    setComments('');
                    setError('');
                  }}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {/* Reject Mode */}
          {rejectMode ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-500">
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ThumbsDown className="text-red-600" />
                Reject Application
              </h4>
              <p className="text-slate-600 mb-4">
                You are about to reject this application. Please provide a reason.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g., Missing required documents. Please resubmit with..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  <AlertCircle size={20} />
                  {loading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
                <button
                  onClick={() => {
                    setRejectMode(false);
                    setComments('');
                    setError('');
                  }}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          {!approveMode && !rejectMode && (
            <div className="flex gap-4">
              <button
                onClick={() => setApproveMode(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <ThumbsUp size={20} />
                Approve
              </button>
              <button
                onClick={() => setRejectMode(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <ThumbsDown size={20} />
                Reject
              </button>
            </div>
          )}
        </>
      )}

      {/* Completed Status */}
      {currentStage === 'completed' && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={28} />
            <h4 className="text-xl font-bold text-green-900">Application Approved</h4>
          </div>
          <p className="text-green-800">
            This application has been fully approved through all stages. The certificate is now ready for download.
          </p>
        </div>
      )}
    </div>
  );
}
