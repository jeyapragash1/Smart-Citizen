'use client';

import React, { useEffect, useState } from 'react';
import {
    Activity,
    Server,
    Users,
    ShieldAlert,
    Database,
    DollarSign,
    Map,
    ArrowUp,
    Loader2,
    Cloud,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react';
import { getSystemStats } from '@/lib/api'; // Import the API helper

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

    // Safe fallbacks so UI renders even if backend fields are missing
    const services = stats?.services || [
        { name: 'Identity & Auth', uptime: '99.95%', status: 'healthy', latency: '120ms' },
        { name: 'Applications API', uptime: '99.82%', status: 'warning', latency: '210ms' },
        { name: 'Payments', uptime: '99.90%', status: 'healthy', latency: '180ms' },
        { name: 'Notifications', uptime: '99.70%', status: 'degraded', latency: '250ms' },
    ];

    const escalations = stats?.escalations || [
        { id: 'ESC-1042', severity: 'High', owner: 'SOC', summary: 'Unusual login spike from overseas IPs', updated: '3m ago' },
        { id: 'ESC-1038', severity: 'Medium', owner: 'DS Ops', summary: 'Certificate signing delays in Kandy DS', updated: '27m ago' },
        { id: 'ESC-1035', severity: 'Low', owner: 'L1 Support', summary: 'SMS delivery latency observed', updated: '1h ago' },
    ];

    const deployments = stats?.deployments || [
        { env: 'Production', version: 'v2.3.5', status: 'Success', time: 'Today 10:12' },
        { env: 'Staging', version: 'v2.3.6-rc', status: 'Running', time: 'Today 14:05' },
        { env: 'DR Site', version: 'v2.3.4', status: 'Idle', time: 'Yesterday' },
    ];

    const approvals = stats?.approvals || { pending: 0, ds: 0, gs: 0, citizens: 0 };

  // Fetch Real Data from Backend
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSystemStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-900" />
        <p>Connecting to Government Cloud...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">National System Monitor</h1>
            <p className="text-sm text-gray-500">Lanka Government Cloud (LGC) • Zone: Colombo-1</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                ALL SYSTEMS OPERATIONAL
            </span>
            <span className="text-xs font-mono text-gray-500">Latency: 24ms</span>
        </div>
      </div>

      {/* 2. National Stats Grid (Dynamic Data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Citizens */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1"><ArrowUp size={12}/> Live</span>
            </div>
            <p className="text-sm text-gray-500">Total Digital Citizens</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.citizens || 0}</h3>
        </div>

        {/* Transactions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Activity size={20} /></div>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1"><ArrowUp size={12}/> +12%</span>
            </div>
            <p className="text-sm text-gray-500">Total Applications</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.transactions || 0}</h3>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                <span className="text-xs font-bold text-gray-400">YTD</span>
            </div>
            <p className="text-sm text-gray-500">Revenue (LKR)</p>
            <h3 className="text-2xl font-bold text-gray-900">{(stats?.revenue || 0).toLocaleString()}</h3>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ShieldAlert size={20} /></div>
                <span className="text-xs font-bold text-red-600 flex items-center gap-1"><ArrowUp size={12}/> Low</span>
            </div>
            <p className="text-sm text-gray-500">Security Threats</p>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Server Health & Database */}
        <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
                <Server size={18} className="text-blue-400"/> Infrastructure Health
            </h3>
            
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">API Gateway Load</span>
                        <span className="font-mono text-blue-300">42%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">MongoDB Atlas (Storage)</span>
                        <span className="font-mono text-green-300">68%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Memory Usage (Redis)</span>
                        <span className="font-mono text-yellow-300">81%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '81%' }}></div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Database size={20} className="mx-auto text-purple-400 mb-2"/>
                    <p className="text-xs text-gray-400">Replica Set</p>
                    <p className="font-bold text-sm text-green-400">Healthy</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Activity size={20} className="mx-auto text-orange-400 mb-2"/>
                    <p className="text-xs text-gray-400">Uptime</p>
                    <p className="font-bold text-sm">99.99%</p>
                </div>
            </div>
        </div>

        {/* 4. Live Activity Log (Dynamic) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Real-time System Logs</h3>
                <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-600 font-medium">Download Logs</button>
            </div>
            <div className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Level</th>
                            <th className="px-6 py-3">Module</th>
                            <th className="px-6 py-3">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-mono text-gray-600">
                        {/* Map through logs if available, otherwise show skeleton/loading */}
                        {stats?.logs ? (
                            stats.logs.map((log: any, index: number) => (
                                <tr key={index} className={log.level === 'WARN' ? 'bg-red-50' : ''}>
                                    <td className="px-6 py-3">{log.time}</td>
                                    <td className="px-6 py-3">
                                        <span className={`font-bold ${log.level === 'INFO' ? 'text-blue-600' : log.level === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">{log.module}</td>
                                    <td className="px-6 py-3">{log.msg}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                                    Waiting for logs...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>

            {/* 6. Service uptime & routing */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Cloud size={18} className="text-blue-500" /> Core services uptime</h3>
                        <span className="text-xs text-gray-500">Rolling 30d</span>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Service</th>
                                <th className="px-4 py-3 text-left font-semibold">Uptime</th>
                                <th className="px-4 py-3 text-left font-semibold">Latency</th>
                                <th className="px-4 py-3 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map((svc: any) => (
                                <tr key={svc.name} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{svc.name}</td>
                                    <td className="px-4 py-3 text-gray-700">{svc.uptime}</td>
                                    <td className="px-4 py-3 text-gray-700">{svc.latency}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${svc.status === 'healthy' ? 'bg-green-100 text-green-700' : svc.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                            {svc.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Approvals pipeline</h3>
                        <Clock size={18} className="text-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-700">
                            <p className="text-xs uppercase">Total pending</p>
                            <p className="text-2xl font-bold">{approvals.pending || 0}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
                            <p className="text-xs uppercase">DS queue</p>
                            <p className="text-2xl font-bold">{approvals.ds || 0}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
                            <p className="text-xs uppercase">GS queue</p>
                            <p className="text-2xl font-bold">{approvals.gs || 0}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700">
                            <p className="text-xs uppercase">Citizen drafts</p>
                            <p className="text-2xl font-bold">{approvals.citizens || 0}</p>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-100">
                        <div className="p-3 flex items-start gap-3">
                            <AlertTriangle size={18} className="text-amber-600" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Ops attention</p>
                                <p className="text-xs text-gray-600">Route stuck approvals to DS with SLA &gt; 24h.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. Escalations & deployments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><ShieldAlert size={18} className="text-red-500" /> Open escalations</h3>
                        <span className="text-xs text-gray-500">SOC & Ops</span>
                    </div>
                    <ul className="divide-y divide-gray-100 text-sm">
                        {escalations.map((item: any) => (
                            <li key={item.id} className="p-4 flex items-start gap-3 hover:bg-gray-50">
                                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">{item.severity[0]}</div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-900">{item.id}</p>
                                        <span className="text-xs text-gray-500">{item.updated}</span>
                                    </div>
                                    <p className="text-gray-700">{item.summary}</p>
                                    <p className="text-xs text-gray-500">Owner: {item.owner}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Activity size={18} className="text-green-600" /> Deployments</h3>
                        <span className="text-xs text-gray-500">CI/CD</span>
                    </div>
                    <ul className="divide-y divide-gray-100 text-sm">
                        {deployments.map((d: any) => (
                            <li key={d.env} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="font-semibold text-gray-900">{d.env}</p>
                                    <p className="text-xs text-gray-500">{d.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono text-gray-800">{d.version}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : d.status === 'Running' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {d.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 8. Data protection checklist */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-600" /> Data protection & continuity</h3>
                    <span className="text-xs text-gray-500">Nightly check</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <p className="font-semibold">Backups</p>
                        <p className="text-xs">Last snapshot: {stats?.backups?.last || 'Today 02:00'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                        <p className="font-semibold">DR readiness</p>
                        <p className="text-xs">{stats?.dr_status || 'Green'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                        <p className="font-semibold">Audit trail</p>
                        <p className="text-xs">{stats?.audit_trail || 'Enabled'}</p>
                    </div>
                </div>
            </div>

      {/* 5. Regional Map Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Map size={18} /> Regional Activity Heatmap</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2">
                <option>Western Province</option>
                <option>Central Province</option>
                <option>Southern Province</option>
            </select>
        </div>
        <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 border-dashed">
            <div className="text-center text-blue-400">
                <Map size={48} className="mx-auto mb-2 opacity-50"/>
                <p>Interactive Sri Lanka Map Module Loading...</p>
                <p className="text-xs">(Requires Mapbox/Google Maps API Key)</p>
            </div>
        </div>
      </div>

    </div>
  );
}