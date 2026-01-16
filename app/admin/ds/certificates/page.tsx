'use client';

import React, { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { getDSCertificates } from '@/lib/api';

export default function DSCertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDSCertificates().then(setCerts).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Issued Certificate History</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/> Loading History...</div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-purple-50 text-purple-900 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-4">Certificate ID</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Issued To</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Download</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {certs.map((c) => (
                        <tr key={c._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono">{c._id.substring(0,8).toUpperCase()}</td>
                            <td className="px-6 py-4">{c.service_type}</td>
                            <td className="px-6 py-4">{c.details.name}</td>
                            <td className="px-6 py-4">{new Date(c.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800"><Download size={18}/></button>
                            </td>
                        </tr>
                    ))}
                    {certs.length === 0 && (
                        <tr><td colSpan={5} className="p-6 text-center text-gray-400">No certificates issued yet.</td></tr>
                    )}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}