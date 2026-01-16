'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileCheck, Users, Clock, AlertTriangle, Search, Filter, CheckCircle, XCircle, Eye, Download, Trash2, Plus, ArrowRight, Loader2, Menu, X, MapPin, Shield, BarChart3 } from 'lucide-react';
import { getGSStats, getVillagers, getLandDisputes, getGSApplications, getGSActivities } from '@/lib/api';

export default function GSDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ pending: 0, villagers: 0, approved: 0, disputes: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [recentVillagers, setRecentVillagers] = useState<any[]>([]);
  const [landDisputes, setLandDisputes] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all data in parallel
        const [statsData, applicationsData, villagersData, disputesData, activitiesData] = await Promise.all([
          getGSStats(),
          getGSApplications(),
          getVillagers(),
          getLandDisputes(),
          getGSActivities()
        ]);
        
        setStats(statsData || { pending: 0, villagers: 0, approved: 0, disputes: 0 });
        setPendingApplications(applicationsData || []);
        setRecentVillagers(villagersData || []);
        setLandDisputes(disputesData || []);
        setRecentActivities(activitiesData || []);
      } catch (error) {
        console.error("Failed to load GS dashboard data", error);
        setError('Failed to load dashboard data');
        // Set empty arrays on error so UI still renders
        setPendingApplications([]);
        setRecentVillagers([]);
        setLandDisputes([]);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const filteredApplications = pendingApplications.filter(app => {
    const subject = (app.name || app.applicant_name || '').toLowerCase();
    const matchesSearch = subject.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📋 Grama Niladhari Overview</h1>
          <p className="text-gray-600 mt-1">Manage applications, villagers, and land records</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          <Plus size={20} /> New Application
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-lg">{error}</div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Pending Review</p>
              <p className="text-3xl font-black text-gray-900 mt-2">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg"><Clock className="text-yellow-600 w-6 h-6" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Villagers</p>
              <p className="text-3xl font-black text-gray-900 mt-2">{stats.villagers}</p>
              <p className="text-xs text-gray-500 mt-2">Registered in jurisdiction</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg"><Users className="text-blue-600 w-6 h-6" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Approved Total</p>
              <p className="text-3xl font-black text-gray-900 mt-2">{stats.approved}</p>
              <p className="text-xs text-gray-500 mt-2">Processed this month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg"><FileCheck className="text-green-600 w-6 h-6" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Land Disputes</p>
              <p className="text-3xl font-black text-gray-900 mt-2">{stats.disputes}</p>
              <p className="text-xs text-gray-500 mt-2">Active cases</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg"><AlertTriangle className="text-red-600 w-6 h-6" /></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h3 className="font-black text-xl mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-gray-50 p-4 rounded-xl text-left transition shadow-md text-gray-900">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-bold text-sm">Approve Application</p>
            <p className="text-xs text-gray-600 mt-1">Review & approve pending</p>
          </button>
          <button className="bg-white hover:bg-gray-50 p-4 rounded-xl text-left transition shadow-md text-gray-900">
            <div className="text-3xl mb-2">👥</div>
            <p className="font-bold text-sm">Register Villager</p>
            <p className="text-xs text-gray-600 mt-1">Add new villager</p>
          </button>
          <button className="bg-white hover:bg-gray-50 p-4 rounded-xl text-left transition shadow-md text-gray-900">
            <div className="text-3xl mb-2">⚖️</div>
            <p className="font-bold text-sm">Manage Disputes</p>
            <p className="text-xs text-gray-600 mt-1">Handle land conflicts</p>
          </button>
          <button className="bg-white hover:bg-gray-50 p-4 rounded-xl text-left transition shadow-md text-gray-900">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-bold text-sm">View Reports</p>
            <p className="text-xs text-gray-600 mt-1">Generate statistics</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-black text-lg">⏳ Pending Applications</h3>
          </div>
          <div className="p-6 space-y-3 border-b border-gray-100">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin w-8 h-8 mx-auto mb-3 text-blue-600" />
              <p className="text-gray-500">Loading applications...</p>
            </div>
          ) : pendingApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Clock size={48} className="mx-auto mb-3 opacity-30" />
              <p>No pending applications</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-bold text-gray-900">Applicant</th>
                    <th className="px-6 py-3 font-bold text-gray-900">Service</th>
                    <th className="px-6 py-3 font-bold text-gray-900">Date</th>
                    <th className="px-6 py-3 font-bold text-gray-900">Priority</th>
                    <th className="px-6 py-3 font-bold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingApplications.map((app) => (
                    <tr key={app.id || app._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{app.name || app.applicant_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-600">{app.service || app.service_type || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-600">{app.date || app.created_at?.slice(0, 10) || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          app.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.priority || 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800"><Eye size={18} /></button>
                        <button className="text-green-600 hover:text-green-800"><CheckCircle size={18} /></button>
                        <button className="text-red-600 hover:text-red-800"><XCircle size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-lg">📊 Recent Activities</h3>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</a>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin w-6 h-6 mx-auto text-blue-600" />
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id || activity._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm text-gray-900">{activity.action || activity.title || 'Activity'}</p>
                    <p className="text-xs text-gray-500">{activity.time || activity.created_at?.slice(0, 10) || 'Recently'}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.details || activity.description || ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Villagers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-black text-lg">👥 Recent Villagers</h3>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">View All <ArrowRight size={16} /></a>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin w-8 h-8 mx-auto mb-3 text-blue-600" />
            <p className="text-gray-500">Loading villagers...</p>
          </div>
        ) : recentVillagers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p>No villagers registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-bold text-gray-900">Name</th>
                  <th className="px-6 py-3 font-bold text-gray-900">NIC</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Phone</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Registered</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Status</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentVillagers.map((villager) => (
                  <tr key={villager.id || villager._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{villager.name || villager.fullname || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{villager.nic || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{villager.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{villager.registered || villager.created_at?.slice(0, 10) || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        villager.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {villager.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800"><Eye size={18} /></button>
                      <button className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Land Disputes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-black text-lg">⚖️ Land Disputes</h3>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">View All <ArrowRight size={16} /></a>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin w-8 h-8 mx-auto mb-3 text-blue-600" />
            <p className="text-gray-500">Loading disputes...</p>
          </div>
        ) : landDisputes.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <AlertTriangle size={48} className="mx-auto mb-3 opacity-30" />
            <p>No land disputes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-bold text-gray-900">Parties</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Area</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Date</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Status</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Severity</th>
                  <th className="px-6 py-3 font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {landDisputes.map((dispute) => (
                  <tr key={dispute.id || dispute._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{dispute.villagers || dispute.parties || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{dispute.area || dispute.location || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{dispute.date || dispute.created_at?.slice(0, 10) || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        dispute.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                        dispute.status === 'Mediation' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {dispute.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        dispute.severity === 'High' ? 'bg-red-100 text-red-700' :
                        dispute.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {dispute.severity || 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800"><Eye size={18} /></button>
                      <button className="text-gray-400 hover:text-gray-600"><Download size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}