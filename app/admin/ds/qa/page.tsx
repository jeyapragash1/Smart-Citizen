'use client';

import React, { useState } from 'react';
import { FileCheck, AlertTriangle } from 'lucide-react';

export default function DSQAPage() {
  const [certs] = useState([
    { id: '1', name: 'Anura Perera', service: 'NIC Certificate', status: 'Pending QA', date: '2025-12-10' },
    { id: '2', name: 'Lakshmi Jayasinghe', service: 'Land Certificate', status: 'Approved', date: '2025-12-09' },
    { id: '3', name: 'Rohan Silva', service: 'Residency Certificate', status: 'Rejected', date: '2025-12-08' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileCheck className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Assurance</h1>
          <p className="text-sm text-gray-600">Review certificates before final issuance</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Citizen Name</th>
              <th className="px-4 py-3 text-left font-semibold">Service</th>
              <th className="px-4 py-3 text-left font-semibold">QA Status</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {certs.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.service}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Pending QA' ? 'bg-yellow-100 text-yellow-700' : c.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.date}</td>
                <td className="px-4 py-3"><button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
