'use client';

import React, { useEffect, useState } from 'react';
import { Users, Loader2, Plus, Eye, Edit2, Trash2, X, Download } from 'lucide-react';
import { getVillagers, addVillager, updateVillager, deleteVillager } from '@/lib/api';

interface Villager {
  id: string;
  fullname: string;
  nic: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ds_division: string;
  gs_section: string;
}

export default function GSVillagersPage() {
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVillager, setSelectedVillager] = useState<Villager | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullname: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    loadVillagers();
  }, []);

  const loadVillagers = async () => {
    try {
      setLoading(true);
      const data = await getVillagers();
      setVillagers(data);
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to load villagers');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddVillager = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVillager(formData);
      showNotification('success', 'Villager added successfully!');
      setShowAddModal(false);
      resetForm();
      loadVillagers();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to add villager');
    }
  };

  const handleUpdateVillager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVillager) return;
    try {
      await updateVillager(selectedVillager.nic, {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      showNotification('success', 'Villager updated successfully!');
      setShowEditModal(false);
      resetForm();
      loadVillagers();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to update villager');
    }
  };

  const handleDeleteVillager = async () => {
    if (!selectedVillager) return;
    try {
      await deleteVillager(selectedVillager.nic);
      showNotification('success', 'Villager deleted successfully!');
      setShowDeleteModal(false);
      setSelectedVillager(null);
      loadVillagers();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to delete villager');
    }
  };

  const openEditModal = (villager: Villager) => {
    setSelectedVillager(villager);
    setFormData({
      fullname: villager.fullname,
      nic: villager.nic,
      email: villager.email,
      phone: villager.phone,
      address: villager.address,
      password: ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (villager: Villager) => {
    setSelectedVillager(villager);
    setShowViewModal(true);
  };

  const openDeleteModal = (villager: Villager) => {
    setSelectedVillager(villager);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullname: '',
      nic: '',
      email: '',
      phone: '',
      address: '',
      password: ''
    });
    setSelectedVillager(null);
  };

  const downloadCSV = () => {
    const headers = ['Full Name', 'NIC', 'Email', 'Phone', 'Address', 'GS Section', 'DS Division', 'District'];
    const rows = villagers.map(v => [
      v.fullname,
      v.nic,
      v.email,
      v.phone,
      v.address,
      v.gs_section,
      v.ds_division,
      v.district
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `villagers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium`}>
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Villager Database
          </h1>
          <p className="text-gray-500 mt-1">Manage citizens in your GS section</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
            Total: {villagers.length}
          </span>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Villager
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="animate-spin mx-auto w-8 h-8 text-blue-600" />
            <p className="mt-4 text-gray-500">Loading villagers...</p>
          </div>
        ) : villagers.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-medium">No villagers found</p>
            <p className="text-sm">Click "Add New Villager" to register citizens</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NIC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">GS Section</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {villagers.map((villager) => (
                <tr key={villager.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{villager.fullname}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{villager.nic}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{villager.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{villager.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{villager.gs_section}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openViewModal(villager)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(villager)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Villager"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(villager)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Villager"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Villager Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Villager</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddVillager} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC *</label>
                <input
                  type="text"
                  required
                  value={formData.nic}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 199812345678"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="07XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Set initial password"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Villager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Villager Modal */}
      {showEditModal && selectedVillager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Edit Villager</h2>
              <button onClick={() => { setShowEditModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateVillager} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                <input
                  type="text"
                  disabled
                  value={formData.nic}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">NIC cannot be modified</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Update Villager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Villager Modal */}
      {showViewModal && selectedVillager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-2xl font-bold">Villager Details</h2>
              <button onClick={() => { setShowViewModal(false); setSelectedVillager(null); }} className="text-white hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIC</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">{selectedVillager.nic}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Province</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.province}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DS Division</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.ds_division}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GS Section</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedVillager.gs_section}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => { setShowViewModal(false); setSelectedVillager(null); }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVillager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-bold">{selectedVillager.fullname}</span> (NIC: {selectedVillager.nic})?
              </p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => { setShowDeleteModal(false); setSelectedVillager(null); }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVillager}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}