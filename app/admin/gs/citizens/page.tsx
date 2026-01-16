'use client';

import { useState, useEffect } from 'react';
import { addCitizen } from '@/lib/api';
import { AlertCircle, CheckCircle, Plus, Loader, Users } from 'lucide-react';

export default function ManageCitizens() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    nic: '',
    phone: '',
    email: '',
    password: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullname || !formData.nic || !formData.phone || !formData.email || !formData.password || !formData.address) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await addCitizen(formData);
      setSuccess(`${formData.fullname} has been registered as a citizen successfully!`);
      setFormData({
        fullname: '',
        nic: '',
        phone: '',
        email: '',
        password: '',
        address: '',
      });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add citizen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Users size={40} />
            Register Citizens
          </h1>
          <p className="text-slate-600">Add new citizens to your village section</p>
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
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex gap-2 items-center transition"
          >
            <Plus size={20} />
            Register New Citizen
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Register New Citizen</h2>
            <p className="text-slate-600 mb-6">Enter the citizen's details to register them in the system</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Nimal Fernando"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">NIC (ID Number) *</label>
                  <input
                    type="text"
                    placeholder="e.g., 200012345678"
                    value={formData.nic}
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g., 0771234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g., nimal@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
                  <input
                    type="password"
                    placeholder="Secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                  <input
                    type="text"
                    placeholder="e.g., 123, Galle Road, Wellawatta"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The citizen will be automatically registered in your section ({localStorage.getItem('userName') || 'Your GS Section'}) and will be able to apply for government services.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Registering...
                    </>
                  ) : (
                    'Register Citizen'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-8 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Info Card */}
        {!showForm && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">How to Register Citizens</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>Click "Register New Citizen" button above to open the registration form</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>Enter the citizen's full name, NIC (ID), phone, and email</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>Set a secure password that the citizen will use to login</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">4.</span>
                <span>Enter their residential address in your village section</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">5.</span>
                <span>Click "Register Citizen" to complete the registration</span>
              </li>
            </ul>
            <p className="text-blue-700 mt-6 text-sm">
              Once registered, the citizen can login and apply for government services through the portal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
