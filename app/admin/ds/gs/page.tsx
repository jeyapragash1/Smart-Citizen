'use client';

import { useState, useEffect } from 'react';
import { addGSOfficer, getGSOfficers } from '@/lib/api';
import { AlertCircle, CheckCircle, Plus, Loader } from 'lucide-react';

interface GSOffice {
  id: string;
  fullname: string;
  nic: string;
  phone: string;
  email: string;
  gs_section: string;
  division: string;
}

export default function ManageGSOfficers() {
  const [officers, setOfficers] = useState<GSOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    nic: '',
    phone: '',
    email: '',
    password: '',
    gs_section: '',
    address: '',
  });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const data = await getGSOfficers();
      setOfficers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load GS officers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullname || !formData.nic || !formData.phone || !formData.email || !formData.password || !formData.gs_section || !formData.address) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await addGSOfficer(formData);
      setSuccess('GS Officer added successfully!');
      setFormData({
        fullname: '',
        nic: '',
        phone: '',
        email: '',
        password: '',
        gs_section: '',
        address: '',
      });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
      await fetchOfficers();
    } catch (err: any) {
      setError(err.message || 'Failed to add GS officer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage GS Officers</h1>
          <p className="text-slate-600">Add and manage Grama Niladhari officers in your division</p>
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
            Add GS Officer
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New GS Officer</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Officer Jayasinghe"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">NIC</label>
                  <input
                    type="text"
                    placeholder="e.g., 987654321V"
                    value={formData.nic}
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g., 0771234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="e.g., gs@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">GS Section</label>
                  <input
                    type="text"
                    placeholder="e.g., Wellawatta GS Section"
                    value={formData.gs_section}
                    onChange={(e) => setFormData({ ...formData, gs_section: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="e.g., Wellawatta GS Office, Colombo 06"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  {loading ? 'Adding...' : 'Add GS Officer'}
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

        {/* Officers List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">GS Officers in Your Division</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center flex justify-center items-center gap-3">
              <Loader className="animate-spin" />
              <span>Loading officers...</span>
            </div>
          ) : officers.length === 0 ? (
            <div className="p-12 text-center text-slate-600">
              <p>No GS officers added yet. Create your first officer above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Officer Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">NIC</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer) => (
                    <tr key={officer.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900 font-semibold">{officer.fullname}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{officer.nic}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{officer.gs_section}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{officer.phone}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{officer.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
