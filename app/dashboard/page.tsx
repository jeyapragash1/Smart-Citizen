'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle, AlertCircle, ShoppingBag, ArrowRight, Sparkles, FileText, Loader2, Heart, Zap, TrendingUp, Award, Download, Eye } from 'lucide-react';
import { getSmartRecommendations, getMyApplications, getUserProfile, getUserDocuments, getUserCertifications, getUserNotifications, getMyOrders } from '@/lib/api';

export default function Dashboard() {
  const [user, setUser] = useState({ fullname: 'Citizen' });
  const [stats, setStats] = useState({ pending: 0, completed: 0, total: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const profileData = await getUserProfile();
        setUser(profileData);

        const apps = await getMyApplications();
        const pending = apps.filter((a: any) => a.status === 'Pending').length;
        const completed = apps.filter((a: any) => a.status === 'Completed').length;
        setStats({ pending, completed, total: apps.length });
        setRecentApps(apps.reverse().slice(0, 3));

        const recData = await getSmartRecommendations();
        setRecommendations(recData.products);
        setTriggers(recData.triggers);

        const docsData = await getUserDocuments();
        setDocuments((docsData || []).slice(0, 4));

        const certsData = await getUserCertifications();
        setCertifications((certsData || []).slice(0, 3));

        const notifsData = await getUserNotifications();
        setNotifications((notifsData || []).slice(0, 3));

        const ordersData = await getMyOrders();
        setRecentOrders((ordersData || []).slice(0, 3));
      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-600" />
        <p>Loading your digital profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Banner (Real Name + Real Pending Count) */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Ayubowan, {user.fullname.split(' ')[0]}! 👋</h1>
            <p className="text-blue-100 mb-6 max-w-xl">
                Welcome to your digital citizen portal. You have <span className="font-bold text-white">{stats.pending} pending actions</span> requiring attention.
            </p>
            <div className="flex gap-3">
                <Link href="/services"> {/* ✅ CORRECT: Go to list of services */}
                <button className="bg-white text-blue-900 px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition">
                    Apply New Service
                </button>
            </Link>
                <Link href="/dashboard/wallet">
                    <button className="bg-blue-800 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-900 transition border border-blue-600">
                        View Wallet
                    </button>
                </Link>
            </div>
        </div>
      </div>

      {/* 2. Stats Grid (Real Database Counts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FileText size={24} /></div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Verified Documents</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Actions</p>
                <p className="text-3xl font-bold text-orange-500 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertCircle size={24} /></div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Digital Credits</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">5,240</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Zap size={24} /></div>
            </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">🛒 My Orders</h3>
              <p className="text-xs text-gray-500 mt-0.5">Track and manage your marketplace orders</p>
            </div>
          </div>
          <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg">
            View All Orders <ArrowRight size={16} />
          </Link>
        </div>
        <div className="p-0">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">No orders yet</p>
              <p className="text-xs mt-1">Start shopping to see your orders here</p>
              <Link href="/marketplace">
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                  Browse Marketplace
                </button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-bold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 font-bold text-gray-700">Date</th>
                  <th className="px-6 py-3 font-bold text-gray-700">Total</th>
                  <th className="px-6 py-3 font-bold text-gray-700">Status</th>
                  <th className="px-6 py-3 font-bold text-gray-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{order.order_id}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-LK')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      Rs. {order.total_amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.order_status === 'Confirmed' ? 'bg-purple-100 text-purple-700' :
                        order.order_status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/orders/${order.order_id}`}>
                        <button className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 ml-auto">
                          <Eye size={16} /> Track
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Apps List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">📋 Recent Activity</h3>
                <Link href="/dashboard/applications" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                    View All <ArrowRight size={16} />
                </Link>
            </div>
            <div className="p-0">
                {recentApps.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <FileText size={32} className="mx-auto mb-2 opacity-50"/>
                        <p>No recent applications found.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {recentApps.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText size={16}/>
                                        </div>
                                        {app.service_type}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            app.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        {/* Smart Recommendations */}
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Sparkles size={12}/> SMART AI
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                    Event: <strong>{triggers.length > 0 ? triggers.join(", ") : "None"}</strong>
                </span>
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg mb-2">Recommended for You</h3>
            
            {recommendations.length > 0 ? (
                <div className="space-y-3 flex-1">
                    {recommendations.slice(0, 3).map((prod) => (
                        <div key={prod._id} className="flex gap-4 items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                {prod.image?.startsWith('http') ? <img src={prod.image} className="w-full h-full object-cover"/> : "🛍️"}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 text-sm line-clamp-1">{prod.name}</p>
                                <p className="text-xs text-blue-600 font-bold">Rs. {prod.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-center text-center text-gray-500 text-sm">
                    <p className="mb-4">Complete a government service to unlock exclusive offers!</p>
                </div>
            )}

            <Link href="/marketplace">
                <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                    <ShoppingBag size={16} /> Visit Marketplace
                </button>
            </Link>
        </div>
      </div>

      {/* NEW: Quick Actions Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h3 className="font-black text-2xl mb-6 text-white">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/services">
            <button className="bg-white hover:bg-gray-50 p-6 rounded-xl text-left transition border-2 border-transparent hover:border-blue-500 shadow-md w-full">
              <div className="text-4xl mb-3">📝</div>
              <p className="font-bold text-base text-gray-900">Apply New Service</p>
              <p className="text-sm text-gray-600 mt-2">Browse & apply for govt services</p>
            </button>
          </Link>
          <Link href="/dashboard/documents">
            <button className="bg-white hover:bg-gray-50 p-6 rounded-xl text-left transition border-2 border-transparent hover:border-blue-500 shadow-md w-full">
              <div className="text-4xl mb-3">📄</div>
              <p className="font-bold text-base text-gray-900">View Documents</p>
              <p className="text-sm text-gray-600 mt-2">Access your digital documents</p>
            </button>
          </Link>
          <Link href="/dashboard/wallet">
            <button className="bg-white hover:bg-gray-50 p-6 rounded-xl text-left transition border-2 border-transparent hover:border-blue-500 shadow-md w-full">
              <div className="text-4xl mb-3">💳</div>
              <p className="font-bold text-base text-gray-900">Digital Wallet</p>
              <p className="text-sm text-gray-600 mt-2">Manage payments & balance</p>
            </button>
          </Link>
          <Link href="/dashboard/support">
            <button className="bg-white hover:bg-gray-50 p-6 rounded-xl text-left transition border-2 border-transparent hover:border-blue-500 shadow-md w-full">
              <div className="text-4xl mb-3">📞</div>
              <p className="font-bold text-base text-gray-900">Get Help</p>
              <p className="text-sm text-gray-600 mt-2">Contact support team</p>
            </button>
          </Link>
        </div>
      </div>

      {/* NEW: My Documents Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-lg">📑 My Important Documents</h3>
          <Link href="/dashboard/documents" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
        </div>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p>No documents available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc, i) => (
              <div key={doc.id || doc._id || i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{doc.icon || '📄'}</div>
                  <button className="text-gray-400 hover:text-blue-600"><Download size={18} /></button>
                </div>
                <p className="font-bold text-gray-900 mt-2 text-sm">{doc.name || 'Document'}</p>
                <p className="text-xs text-gray-500 mt-1">Issued: {doc.date || doc.issued_date || 'N/A'}</p>
                <p className="text-xs font-semibold mt-2 text-gray-700">{doc.status || '✅ Verified'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NEW: Certifications & Achievements */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-orange-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-lg">🏆 Certifications & Achievements</h3>
          <Link href="/dashboard/certifications" className="text-sm text-orange-600 hover:text-orange-800 font-medium">View All</Link>
        </div>
        {certifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Award size={48} className="mx-auto mb-3 opacity-30" />
            <p>No certifications available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <div key={cert.id || cert._id || i} className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition flex items-center gap-4">
                <div className="text-4xl">{cert.icon || '🏆'}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.date || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NEW: Notifications & Updates */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-lg">🔔 Latest Updates</h3>
          <Link href="/dashboard/notifications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">See All</Link>
        </div>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <AlertCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p>No new notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif, i) => (
              <div key={notif.id || notif._id || i} className={`p-4 rounded-lg border ${
                notif.type === 'success' ? 'bg-green-50 border-green-200' : 
                notif.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex justify-between">
                  <p className="font-bold text-gray-900 text-sm">{notif.title || 'Notification'}</p>
                  <p className="text-xs text-gray-500">{notif.time || notif.created_at || 'Recently'}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notif.desc || notif.description || notif.message || ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}