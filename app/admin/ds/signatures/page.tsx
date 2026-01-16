'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Download, Loader2, AlertCircle } from 'lucide-react';
import { getSignatureTemplates } from '@/lib/api';

export default function DSSignaturesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setError('');
      const data = await getSignatureTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin" size={32} /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Signatures & Seals</h1>
          <p className="text-sm text-gray-600">Manage DS signature templates and certificate seals</p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-600">No signature templates found</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Template Name</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {templates.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-gray-700">{t.created_date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3"><button className="text-blue-600 hover:text-blue-800"><Download size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
