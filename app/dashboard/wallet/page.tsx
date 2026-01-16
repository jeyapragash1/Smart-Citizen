'use client';

import React, { useEffect, useState } from 'react';
import { QrCode, Download, Share2, ShieldCheck, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { getWalletDocuments } from '@/lib/api';

export default function WalletPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const data = await getWalletDocuments();
        setDocuments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2"/> Loading Wallet...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Digital Wallet</h1>
        <p className="text-gray-500">Securely store and share your government-issued documents.</p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl border border-dashed border-gray-300">
            <ShieldCheck size={48} className="mx-auto text-gray-300 mb-2"/>
            <p className="text-gray-500">No verified documents yet.</p>
            <p className="text-sm text-gray-400">Approved certificates will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-2xl shadow-lg text-white p-6 bg-gradient-to-br from-blue-900 to-blue-700 h-56 flex flex-col justify-between transition-transform hover:-translate-y-1">
                    
                    <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                <ShieldCheck size={20} className="text-white" />
                            </div>
                            <span className="font-medium text-white/90 text-sm tracking-wide">VERIFIED</span>
                        </div>
                        <button className="text-white/70 hover:text-white"><MoreVertical size={20}/></button>
                    </div>

                    <div className="z-10">
                        <h3 className="text-xl font-bold tracking-wide">{doc.title}</h3>
                        <p className="text-white/70 font-mono text-sm mt-1">ID: {doc.id.substring(0,8).toUpperCase()}</p>
                        <p className="text-xs text-white/50 mt-4 uppercase tracking-wider">Issued: {new Date(doc.issued_date).toLocaleDateString()}</p>
                    </div>

                    <div className="absolute -bottom-8 -right-8 text-white/10">
                        <ShieldCheck size={150} />
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Action Bar */}
      {documents.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h4 className="font-bold text-gray-900">Share Documents Securely</h4>
                <p className="text-sm text-gray-500">Generate a temporary QR code for banks or officials.</p>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                    <QrCode size={18} /> Show QR
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                    <Share2 size={18} /> Share via Link
                </button>
            </div>
        </div>
      )}
    </div>
  );
}