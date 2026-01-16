"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Building2, ShieldCheck, AlertTriangle, Users, Activity, Loader2, AlertCircle } from "lucide-react";
import { getAllDivisions, getAuditLogs } from "@/lib/api";

export default function DSRegionalPage() {
	const [divisions, setDivisions] = useState<any[]>([]);
	const [incidents, setIncidents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function loadData() {
			try {
				setError('');
				const divsData = await getAllDivisions();
				const logsData = await getAuditLogs();
				
				setDivisions(Array.isArray(divsData) ? divsData : divsData.divisions || []);
				setIncidents(Array.isArray(logsData) ? logsData.slice(0, 5) : logsData.logs?.slice(0, 5) || []);
			} catch (err: any) {
				setError(err.message || 'Failed to load regional data');
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	if (loading) return (
		<div className="flex items-center justify-center h-64">
			<Loader2 className="animate-spin text-blue-600" size={32} />
		</div>
	);

	if (error) return (
		<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
			<AlertCircle size={16} /> {error}
		</div>
	);
	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Regional Operations</h1>
					<p className="text-sm text-gray-600">Division coverage, GN clusters, and live escalations</p>
				</div>
				<span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">DS view</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-3">
					<div className="p-3 rounded-lg bg-indigo-50 text-indigo-700">
						<MapPin className="w-6 h-6" />
					</div>
					<div>
						<p className="text-xs text-gray-500 uppercase tracking-wide">Divisions</p>
						<p className="text-2xl font-bold text-gray-900">{divisions.length}</p>
					</div>
				</div>

				<div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-3">
					<div className="p-3 rounded-lg bg-emerald-50 text-emerald-700">
						<Building2 className="w-6 h-6" />
					</div>
					<div>
						<p className="text-xs text-gray-500 uppercase tracking-wide">Subdivisions</p>
						<p className="text-2xl font-bold text-gray-900">{divisions.reduce((acc: number, d: any) => acc + (d.gn_count || 0), 0)}</p>
					</div>
				</div>

				<div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-3">
					<div className="p-3 rounded-lg bg-blue-50 text-blue-700">
						<Users className="w-6 h-6" />
					</div>
					<div>
						<p className="text-xs text-gray-500 uppercase tracking-wide">Coverage</p>
						<p className="text-2xl font-bold text-gray-900">{divisions.length > 0 ? '100%' : '0%'}</p>
					</div>
				</div>

				<div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-3">
					<div className="p-3 rounded-lg bg-amber-50 text-amber-700">
						<Activity className="w-6 h-6" />
					</div>
					<div>
						<p className="text-xs text-gray-500 uppercase tracking-wide">Active Issues</p>
						<p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
				<div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
					<div className="p-4 border-b border-gray-100 flex items-center justify-between">
						<div>
							<h2 className="text-lg font-bold text-gray-900">Divisional coverage</h2>
							<p className="text-sm text-gray-600">Divisions and their GN clusters</p>
						</div>
						<ShieldCheck className="text-emerald-600" />
					</div>
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-600 border-b">
							<tr>
								<th className="px-4 py-3 text-left font-semibold">Division</th>
								<th className="px-4 py-3 text-left font-semibold">District</th>
								<th className="px-4 py-3 text-left font-semibold">Province</th>
								<th className="px-4 py-3 text-left font-semibold">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{divisions.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-4 py-3 text-center text-gray-500">No division data available</td>
								</tr>
							) : (
								divisions.map((d: any) => (
									<tr key={d._id || d.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 font-medium text-gray-900">{d.division || d.name}</td>
										<td className="px-4 py-3 text-gray-700">{d.district}</td>
										<td className="px-4 py-3 text-gray-700">{d.province}</td>
										<td className="px-4 py-3">
											<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
												<span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
					<div className="p-4 border-b border-gray-100 flex items-center justify-between">
						<div>
							<h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
							<p className="text-sm text-gray-600">Latest audit events</p>
						</div>
						<AlertTriangle className="text-amber-600" />
					</div>
					<ul className="divide-y divide-gray-100 text-sm">
						{incidents.length === 0 ? (
							<li className="p-4 text-center text-gray-500">No recent activity</li>
						) : (
							incidents.map((item: any) => (
								<li key={item._id || item.id} className="p-4 hover:bg-gray-50">
									<div className="flex items-start justify-between gap-3">
										<div className="space-y-1">
											<p className="text-xs font-semibold text-gray-500">{new Date(item.timestamp || item.created_at).toLocaleTimeString()}</p>
											<p className="font-medium text-gray-900">{item.action || item.message}</p>
											<p className="text-xs text-gray-500">{item.actor || item.user || 'System'}</p>
										</div>
										<span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'success' || item.status === 'completed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
											{item.status || 'Active'}
										</span>
									</div>
								</li>
							))
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
