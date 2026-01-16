'use client';

import React, { useEffect, useState } from 'react';
import { UserPlus, Trash2, Edit, X, Save, Loader2, Mail, Phone, Download, Eye, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { getAllOfficers, deleteOfficer, registerUser, updateOfficer, verifyOfficer } from '@/lib/api';

export default function AdminUsersPage() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [filteredOfficers, setFilteredOfficers] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<'all' | 'ds' | 'gs'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
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
  
  // Form State
  const [formData, setFormData] = useState({ 
    fullname: '', 
    nic: '', 
    email: '', 
    role: 'gs', 
    phone: '', 
    password: 'admin' 
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    id: '',
    fullname: '',
    nic: '',
    email: '',
    role: 'gs',
    phone: '',
    division: ''
  });

  // 1. Load Data
  const loadData = async () => {
    try {
        const data = await getAllOfficers();
        setOfficers(data);
    } catch(e) { 
        console.error("Failed to load officers", e); 
    }
  };

  // Apply filter whenever officers or filterRole changes
  useEffect(() => {
    if (filterRole === 'all') {
      setFilteredOfficers(officers);
    } else {
      setFilteredOfficers(officers.filter(officer => officer.role === filterRole));
    }
  }, [officers, filterRole]);

  useEffect(() => { loadData(); }, []);

  // 2. Handle Create Officer
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        await registerUser(formData); 
        showNotification('success', 'Officer Created Successfully!');
        setIsModalOpen(false);
        // Reset form
        setFormData({ fullname: '', nic: '', email: '', role: 'gs', phone: '', password: 'admin' });
        loadData(); 
    } catch (e: any) { 
        console.error(e);
        showNotification('error', e.message || 'Failed to create officer');
    } finally {
        setLoading(false);
    }
  };

  // 3. Handle View
  const handleView = (officer: any) => {
    setSelectedOfficer(officer);
    setIsViewModalOpen(true);
  };

  // 4. Handle Edit
  const handleEdit = (officer: any) => {
    setSelectedOfficer(officer);
    setEditFormData({
      id: officer.id,
      fullname: officer.fullname,
      nic: officer.nic,
      email: officer.email,
      role: officer.role,
      phone: officer.phone || '',
      division: officer.division || ''
    });
    setIsEditModalOpen(true);
  };

  // 5. Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        fullname: editFormData.fullname,
        email: editFormData.email,
        phone: editFormData.phone,
        role: editFormData.role,
        division: editFormData.division
      };
      await updateOfficer(editFormData.id, payload);
      showNotification('success', 'Officer Updated Successfully!');
      setIsEditModalOpen(false);
      loadData();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to update officer');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Delete
  const handleDelete = (officer: any) => {
    setSelectedOfficer(officer);
    setIsDeleteModalOpen(true);
  };

  // 7. Confirm Delete
  const confirmDelete = async () => {
    if (!selectedOfficer) return;
    try {
      await deleteOfficer(selectedOfficer.id);
      showNotification('success', 'Officer deleted successfully!');
      setIsDeleteModalOpen(false);
      loadData();
    } catch (e) {
      showNotification('error', 'Failed to delete officer');
    }
  };

  // 8. Handle Verify Officer
  const handleVerify = async (officer: any) => {
    setLoading(true);
    try {
      await verifyOfficer(officer.id);
      showNotification('success', `${officer.fullname} verified successfully!`);
      loadData();
    } catch (e: any) {
      showNotification('error', e.message || 'Failed to verify officer');
    } finally {
      setLoading(false);
    }
  };

  // 9. Handle Excel Download
  const handleDownloadExcel = () => {
    if (officers.length === 0) {
      showNotification('error', 'No data to download!');
      return;
    }

    // Prepare data for Excel
    const excelData = officers.map((officer, index) => ({
      'No': index + 1,
      'Full Name': officer.fullname,
      'Role': officer.role.toUpperCase(),
      'Email': officer.email,
      'Division': officer.division || 'N/A',
      'Officer ID': officer.id
    }));

    // Create CSV content
    const headers = Object.keys(excelData[0]).join(',');
    const rows = excelData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = headers + '\n' + rows;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Officer_Management_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Officer Management</h1>
        <div className="flex gap-3">
          <button 
              onClick={handleDownloadExcel} 
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition shadow-md"
          >
              <Download size={18} /> Download Summary
          </button>
          <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-md"
          >
              <UserPlus size={18} /> Add New Officer
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <span className="text-sm font-semibold text-gray-700">Filter by Role:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterRole === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Officers ({officers.length})
          </button>
          <button
            onClick={() => setFilterRole('ds')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterRole === 'ds'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            DS ({officers.filter(o => o.role === 'ds').length})
          </button>
          <button
            onClick={() => setFilterRole('gs')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterRole === 'gs'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            GS ({officers.filter(o => o.role === 'gs').length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Email / Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOfficers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-900">{user.fullname}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                user.role === 'gs' ? 'bg-blue-100 text-blue-800' : 
                                user.role === 'ds' ? 'bg-purple-100 text-purple-800' : 
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{user.email}</td>
                        <td className="px-6 py-4">
                            {user.is_verified ? (
                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                    <CheckCircle size={14} /> Verified
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">
                                    <AlertCircle size={14} /> Pending
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2 flex-wrap">
                            <button 
                              onClick={() => handleView(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye size={16}/>
                            </button>
                            <button 
                              onClick={() => handleEdit(user)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Edit Officer"
                            >
                              <Edit size={16}/>
                            </button>
                            {!user.is_verified && (
                              <button 
                                onClick={() => handleVerify(user)}
                                disabled={loading}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition disabled:opacity-50"
                                title="Verify Officer"
                              >
                                <Shield size={16}/>
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Officer"
                            >
                              <Trash2 size={16}/>
                            </button>
                        </td>
                    </tr>
                ))}
                {filteredOfficers.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                            No officers found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <UserPlus size={20}/> Register New Officer
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
                
                {/* Row 1: Name & NIC */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                        <input required placeholder="K. Silva" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm" value={formData.fullname} onChange={e => setFormData({...formData, fullname: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">NIC Number</label>
                        <input required placeholder="1990xxxxxxV" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm font-mono" value={formData.nic} onChange={e => setFormData({...formData, nic: e.target.value})} />
                    </div>
                </div>

                {/* Row 2: Role Selection */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Role</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="gs">Grama Niladhari (GS)</option>
                        <option value="ds">Divisional Secretary (DS)</option>
                        <option value="admin">System Admin</option>
                    </select>
                </div>

                {/* Row 3: Email & Phone (THIS WAS MISSING!) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Official Email</label>
                        <div className="relative">
                            <Mail className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"/>
                            <input required type="email" placeholder="officer@gov.lk" className="w-full pl-8 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"/>
                            <input required type="tel" placeholder="077xxxxxxx" className="w-full pl-8 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Row 4: Password */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Default Password</label>
                    <input required type="password" placeholder="••••••" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                {/* Buttons */}
                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
                        {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16} /> Create Account</>}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Eye size={20}/> Officer Details
              </h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white/80 hover:text-white transition">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedOfficer.fullname}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NIC Number</label>
                  <p className="text-lg font-mono text-gray-900">{selectedOfficer.nic || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold uppercase ${
                    selectedOfficer.role === 'gs' ? 'bg-blue-100 text-blue-800' : 
                    selectedOfficer.role === 'ds' ? 'bg-purple-100 text-purple-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedOfficer.role}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Officer ID</label>
                  <p className="text-lg text-gray-900">{selectedOfficer.id}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <p className="text-lg text-gray-900">{selectedOfficer.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <p className="text-lg text-gray-900">{selectedOfficer.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Verification Status</label>
                  {selectedOfficer.is_verified ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg">
                      <CheckCircle size={16} /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-lg">
                      <AlertCircle size={16} /> Pending
                    </span>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Division</label>
                  <p className="text-lg text-gray-900">{selectedOfficer.division || 'Not Assigned'}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setIsViewModalOpen(false)} 
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Edit size={20}/> Edit Officer
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white transition">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input 
                    required 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 text-sm" 
                    value={editFormData.fullname} 
                    onChange={e => setEditFormData({...editFormData, fullname: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">NIC Number</label>
                  <input 
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm font-mono cursor-not-allowed" 
                    value={editFormData.nic} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Role</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 text-sm bg-white" 
                  value={editFormData.role} 
                  onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                >
                  <option value="gs">Grama Niladhari (GS)</option>
                  <option value="ds">Divisional Secretary (DS)</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 text-sm" 
                    value={editFormData.email} 
                    onChange={e => setEditFormData({...editFormData, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 text-sm" 
                    value={editFormData.phone} 
                    onChange={e => setEditFormData({...editFormData, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Division</label>
                <input 
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 text-sm" 
                  value={editFormData.division} 
                  onChange={e => setEditFormData({...editFormData, division: e.target.value})} 
                  placeholder="Enter division name"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16} /> Update Officer</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Trash2 size={24}/>
                </div>
                <h3 className="text-lg font-bold">Delete Officer</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-bold text-gray-900">{selectedOfficer.fullname}</span>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                ⚠️ This action cannot be undone. All data associated with this officer will be permanently removed.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16}/> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}