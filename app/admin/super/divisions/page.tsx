'use client';

import { useState, useEffect } from 'react';
import { assignDSToDiv, getAllDivisions, updateDivision, deleteDivision } from '@/lib/api';
import { AlertCircle, CheckCircle, Plus, Loader, Edit, Trash2, Eye, X } from 'lucide-react';

interface Division {
  ds_nic: string;
  ds_name: string;
  province: string;
  district: string;
  division: string;
  phone: string;
  email: string;
}

export default function ManageDivisions() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);

  const [formData, setFormData] = useState({
    ds_nic: '',
    province: '',
    district: '',
    ds_division: '',
  });

  const [editFormData, setEditFormData] = useState({
    ds_name: '',
    ds_nic: '',
    province: '',
    district: '',
    division: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const data = await getAllDivisions();
      setDivisions(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load divisions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ds_nic || !formData.province || !formData.district || !formData.ds_division) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await assignDSToDiv(formData);
      setSuccess('DS assigned to division successfully!');
      setFormData({ ds_nic: '', province: '', district: '', ds_division: '' });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
      await fetchDivisions();
    } catch (err: any) {
      setError(err.message || 'Failed to assign DS');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (division: Division) => {
    setSelectedDivision(division);
    setShowViewModal(true);
  };

  const handleEdit = (division: Division) => {
    setSelectedDivision(division);
    setEditFormData({
      ds_name: division.ds_name,
      ds_nic: division.ds_nic,
      province: division.province,
      district: division.district,
      division: division.division,
      phone: division.phone,
      email: division.email,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDivision) return;
    
    try {
      setLoading(true);
      await updateDivision(selectedDivision.ds_nic, editFormData);
      setSuccess('Division updated successfully!');
      setShowEditModal(false);
      setTimeout(() => setSuccess(''), 3000);
      await fetchDivisions();
    } catch (err: any) {
      setError(err.message || 'Failed to update division');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (division: Division) => {
    setSelectedDivision(division);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedDivision) return;
    
    try {
      setLoading(true);
      await deleteDivision(selectedDivision.ds_nic);
      setSuccess('Division removed successfully!');
      setShowDeleteModal(false);
      setTimeout(() => setSuccess(''), 3000);
      await fetchDivisions();
    } catch (err: any) {
      setError(err.message || 'Failed to delete division');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage DS Divisions</h1>
          <p className="text-slate-600">Assign Divisional Secretaries to districts and divisions</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Success</p>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex gap-2 items-center transition"
          >
            <Plus size={20} />
            Assign DS to Division
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Assign DS to Division</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">DS NIC</label>
                  <input
                    type="text"
                    placeholder="e.g., 777777777V"
                    value={formData.ds_nic}
                    onChange={(e) => setFormData({ ...formData, ds_nic: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Province</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Province</option>
                    <option value="Western">Western</option>
                    <option value="Central">Central</option>
                    <option value="Southern">Southern</option>
                    <option value="Northern">Northern</option>
                    <option value="Eastern">Eastern</option>
                    <option value="North Central">North Central</option>
                    <option value="North Western">North Western</option>
                    <option value="Uva">Uva</option>
                    <option value="Sabaragamuwa">Sabaragamuwa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">District</label>
                  <input
                    type="text"
                    placeholder="e.g., Colombo"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">DS Division</label>
                  <input
                    type="text"
                    placeholder="e.g., Colombo DS Division"
                    value={formData.ds_division}
                    onChange={(e) => setFormData({ ...formData, ds_division: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign Division'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Divisions List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Current Divisions</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center flex justify-center items-center gap-3">
              <Loader className="animate-spin" />
              <span>Loading divisions...</span>
            </div>
          ) : divisions.length === 0 ? (
            <div className="p-12 text-center text-slate-600">
              <p>No divisions assigned yet. Create your first assignment above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">DS Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">NIC</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Province</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">District</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Division</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {divisions.map((div, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900 font-semibold">{div.ds_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{div.ds_nic}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{div.province}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{div.district}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{div.division}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{div.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleView(div)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(div)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(div)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
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

        {/* View Modal */}
        {showViewModal && selectedDivision && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">DS Division Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">DS Name</label>
                    <p className="text-lg text-slate-900">{selectedDivision.ds_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">NIC</label>
                    <p className="text-lg text-slate-900">{selectedDivision.ds_nic}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Province</label>
                    <p className="text-lg text-slate-900">{selectedDivision.province}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">District</label>
                    <p className="text-lg text-slate-900">{selectedDivision.district}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Division</label>
                    <p className="text-lg text-slate-900">{selectedDivision.division}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Phone</label>
                    <p className="text-lg text-slate-900">{selectedDivision.phone || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Email</label>
                    <p className="text-lg text-slate-900">{selectedDivision.email}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedDivision && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Edit DS Division</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">DS Name</label>
                    <input
                      type="text"
                      value={editFormData.ds_name}
                      onChange={(e) => setEditFormData({ ...editFormData, ds_name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">NIC</label>
                    <input
                      type="text"
                      value={editFormData.ds_nic}
                      disabled
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Province</label>
                    <select
                      value={editFormData.province}
                      onChange={(e) => setEditFormData({ ...editFormData, province: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Province</option>
                      <option value="Western">Western</option>
                      <option value="Central">Central</option>
                      <option value="Southern">Southern</option>
                      <option value="Northern">Northern</option>
                      <option value="Eastern">Eastern</option>
                      <option value="North Central">North Central</option>
                      <option value="North Western">North Western</option>
                      <option value="Uva">Uva</option>
                      <option value="Sabaragamuwa">Sabaragamuwa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">District</label>
                    <input
                      type="text"
                      value={editFormData.district}
                      onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Division</label>
                    <input
                      type="text"
                      value={editFormData.division}
                      onChange={(e) => setEditFormData({ ...editFormData, division: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Division'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedDivision && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Trash2 className="text-red-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Delete Division</h2>
                </div>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete the division assignment for <span className="font-semibold">{selectedDivision.ds_name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
