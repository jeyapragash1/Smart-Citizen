'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { getLandDisputes, addLandDispute } from '@/lib/api';

export default function GSLandPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', parties_involved: '' });
  const [error, setError] = useState('');

  // Load Data
  const loadData = async () => {
    try {
        const data = await getLandDisputes();
        setDisputes(data);
        setError('');
    } catch(e: any) { 
        console.error(e);
        setError(e?.message || 'Failed to load disputes');
    }
  };

  useEffect(() => { loadData(); }, []);

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLandDispute(form);
      setIsModalOpen(false);
      setForm({ title: '', description: '', parties_involved: '' });
      loadData();
      setError('');
    } catch (e: any) {
      setError(e?.message || 'Failed to log dispute');
    }
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Land Dispute Registry</h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
                <Plus size={18}/> Log New Dispute
            </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {error && <div className="md:col-span-2 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-lg">{error}</div>}
          {disputes.map((d) => (
            <div key={d._id} className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{d.title}</h3>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">{d.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2"><strong>Parties:</strong> {d.parties_involved}</p>
                <p className="text-sm text-gray-500">{d.description}</p>
                <p className="text-xs text-gray-400 mt-4 text-right">{new Date(d.date).toLocaleDateString()}</p>
            </div>
          ))}
          {disputes.length === 0 && <p className="text-gray-500">No active land disputes.</p>}
       </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Log Land Dispute</h3>
                    <button onClick={() => setIsModalOpen(false)}><X/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input required placeholder="Dispute Title (e.g. Boundary Issue)" className="w-full p-2 border rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    <input required placeholder="Parties Involved (Names)" className="w-full p-2 border rounded" value={form.parties_involved} onChange={e => setForm({...form, parties_involved: e.target.value})} />
                    <textarea required placeholder="Description of the issue..." className="w-full p-2 border rounded" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold">Save Record</button>
                </form>
            </div>
        </div>
       )}
    </div>
  );
}