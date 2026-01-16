'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Loader2, Search, Download, Eye, Plus, Edit2, Trash2, X, Award } from 'lucide-react';
import { getGSCertificates, issueCertificate, updateCertificate, deleteCertificate, getVillagers } from '@/lib/api';

interface Certificate {
  id: string;
  certificate_number: string;
  recipient_name: string;
  recipient_nic: string;
  certificate_type: string;
  purpose: string;
  issued_date: string;
  issued_by: string;
  gs_section: string;
  status: string;
  remarks: string;
}

interface Villager {
  id: string;
  fullname: string;
  nic: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_nic: '',
    certificate_type: 'Character Certificate',
    purpose: '',
    remarks: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [certsData, villagersData] = await Promise.all([getGSCertificates(), getVillagers()]);
      setCertificates(Array.isArray(certsData) ? certsData : []);
      setVillagers(Array.isArray(villagersData) ? villagersData : []);
    } catch (err: any) {
      showNotification('error', err?.message || 'Failed to load data');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await issueCertificate(formData);
      showNotification('success', 'Certificate issued successfully!');
      setShowIssueModal(false);
      resetForm();
      loadData();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to issue certificate');
    }
  };

  const handleUpdateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCertificate) return;
    try {
      await updateCertificate(selectedCertificate.id, {
        recipient_name: formData.recipient_name,
        certificate_type: formData.certificate_type,
        purpose: formData.purpose,
        remarks: formData.remarks
      });
      showNotification('success', 'Certificate updated successfully!');
      setShowEditModal(false);
      resetForm();
      loadData();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to update certificate');
    }
  };

  const handleDeleteCertificate = async () => {
    if (!selectedCertificate) return;
    try {
      await deleteCertificate(selectedCertificate.id);
      showNotification('success', 'Certificate deleted successfully!');
      setShowDeleteModal(false);
      setSelectedCertificate(null);
      loadData();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to delete certificate');
    }
  };

  const openEditModal = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setFormData({
      recipient_name: cert.recipient_name,
      recipient_nic: cert.recipient_nic,
      certificate_type: cert.certificate_type,
      purpose: cert.purpose,
      remarks: cert.remarks
    });
    setShowEditModal(true);
  };

  const openViewModal = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setShowViewModal(true);
  };

  const openDeleteModal = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      recipient_name: '',
      recipient_nic: '',
      certificate_type: 'Character Certificate',
      purpose: '',
      remarks: ''
    });
    setSelectedCertificate(null);
  };

  const selectVillager = (villager: Villager) => {
    setFormData({
      ...formData,
      recipient_name: villager.fullname,
      recipient_nic: villager.nic
    });
  };

  const downloadCertificate = (cert: Certificate) => {
    const content = `
CERTIFICATE
Certificate Number: ${cert.certificate_number}
Issued Date: ${cert.issued_date}

TO WHOM IT MAY CONCERN

This is to certify that ${cert.recipient_name} (NIC: ${cert.recipient_nic}) \nis a resident under the ${cert.gs_section}.

Type: ${cert.certificate_type}
Purpose: ${cert.purpose}

Issued by: ${cert.issued_by}
Status: ${cert.status}

${cert.remarks ? 'Remarks: ' + cert.remarks : ''}

This certificate is issued upon request.
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.certificate_number}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCerts = certificates.filter(cert => {
    const matchesSearch =
      cert.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.recipient_nic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const issuedCount = certificates.filter(c => c.status === 'Issued').length;
  const pendingCount = certificates.filter(c => c.status === 'Pending').length;
  const thisMonthCount = certificates.filter(c => {
    const certDate = new Date(c.issued_date);
    const now = new Date();
    return certDate.getMonth() === now.getMonth() && certDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-medium`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600" />
            Certificates
          </h1>
          <p className="text-gray-600 text-sm mt-1">Manage and issue certificates to villagers</p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium transition-colors shadow-md"
        >
          <Plus size={20} /> Issue Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-blue-100 text-sm font-medium mb-2">Total Issued</p>
          <p className="text-4xl font-bold">{issuedCount}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-amber-100 text-sm font-medium mb-2">Pending</p>
          <p className="text-4xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-purple-100 text-sm font-medium mb-2">This Month</p>
          <p className="text-4xl font-bold">{thisMonthCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates or recipients..."
            className="bg-transparent w-full outline-none text-gray-900"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="issued">Issued</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-3" size={36} />
            <p className="text-gray-600">Loading certificates...</p>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No certificates found</p>
            <p className="text-sm mt-1">Click "Issue Certificate" to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Certificate #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Issued</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCerts.map(cert => (
                  <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-600">{cert.certificate_number}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{cert.recipient_name}</div>
                      <div className="text-xs text-gray-500">{cert.recipient_nic}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cert.certificate_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(cert.issued_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cert.status === 'Issued' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openViewModal(cert)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadCertificate(cert)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(cert)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(cert)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-2xl font-bold">Issue New Certificate</h2>
              <button
                onClick={() => {
                  setShowIssueModal(false);
                  resetForm();
                }}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleIssueCertificate} className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Select Villager</label>
                <select
                  onChange={e => {
                    const villager = villagers.find(v => v.nic === e.target.value);
                    if (villager) selectVillager(villager);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select a villager --</option>
                  {villagers.map(v => (
                    <option key={v.id} value={v.nic}>
                      {v.fullname} ({v.nic})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">Or manually enter details below</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.recipient_name}
                    onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient NIC *</label>
                  <input
                    type="text"
                    required
                    value={formData.recipient_nic}
                    onChange={e => setFormData({ ...formData, recipient_nic: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="NIC number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type *</label>
                <select
                  required
                  value={formData.certificate_type}
                  onChange={e => setFormData({ ...formData, certificate_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Character Certificate">Character Certificate</option>
                  <option value="Residence Certificate">Residence Certificate</option>
                  <option value="Income Certificate">Income Certificate</option>
                  <option value="Identity Certificate">Identity Certificate</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                <textarea
                  required
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Purpose of certificate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                <textarea
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Additional notes"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowIssueModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Edit Certificate</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateCertificate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Number</label>
                <input
                  type="text"
                  disabled
                  value={selectedCertificate.certificate_number}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.recipient_name}
                  onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type *</label>
                <select
                  required
                  value={formData.certificate_type}
                  onChange={e => setFormData({ ...formData, certificate_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Character Certificate">Character Certificate</option>
                  <option value="Residence Certificate">Residence Certificate</option>
                  <option value="Income Certificate">Income Certificate</option>
                  <option value="Identity Certificate">Identity Certificate</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                <textarea
                  required
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Update Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-2xl font-bold">Certificate Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCertificate(null);
                }}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center border-b-2 border-gray-200 pb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedCertificate.certificate_type}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Certificate Number: <span className="font-mono font-bold text-blue-600">{selectedCertificate.certificate_number}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Recipient Name</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCertificate.recipient_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Recipient NIC</p>
                    <p className="text-lg font-mono font-semibold text-gray-900">{selectedCertificate.recipient_nic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issued Date</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(selectedCertificate.issued_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        selectedCertificate.status === 'Issued'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedCertificate.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="text-base text-gray-900">{selectedCertificate.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issued By</p>
                    <p className="text-base font-semibold text-gray-900">{selectedCertificate.issued_by}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">GS Section</p>
                    <p className="text-base font-semibold text-gray-900">{selectedCertificate.gs_section}</p>
                  </div>
                  {selectedCertificate.remarks && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Remarks</p>
                      <p className="text-base text-gray-700">{selectedCertificate.remarks}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-top border-gray-200">
                <button
                  onClick={() => downloadCertificate(selectedCertificate)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedCertificate(null);
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete certificate <span className="font-bold">{selectedCertificate.certificate_number}</span> for{' '}
                <span className="font-bold">{selectedCertificate.recipient_name}</span>?
              </p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCertificate(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button onClick={handleDeleteCertificate} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
