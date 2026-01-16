'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, ScanLine, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getCertificateStatus } from '@/lib/api';

type VerifyResult = {
    found: boolean;
    status?: string;
    issued_to?: string;
    issued_on?: string;
    service_type?: string;
    certificate_path?: string;
    application_id?: string;
};

export default function VerifyPage() {
    const [docId, setDocId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerifyResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResult(null);
        if (!docId || docId.trim().length === 0) {
            setError('Please enter a Certificate ID');
            return;
        }

        setLoading(true);
        try {
            const res = await getCertificateStatus(docId.trim());
            setResult(res);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch certificate status');
        } finally {
            setLoading(false);
        }
    };

    const renderStatusCard = () => {
        if (!result) return null;
        if (!result.found) {
            return (
                <div className="mt-10 p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-4 text-left shadow-lg">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 flex-shrink-0"><XCircle className="w-7 h-7" /></div>
                    <div className="flex-1">
                        <h4 className="font-black text-red-900 text-lg">Certificate Not Found</h4>
                        <p className="text-sm text-red-700 font-semibold mt-1">No certificate matches the provided reference.</p>
                    </div>
                </div>
            );
        }

        const status = (result.status || 'Pending').toLowerCase();
        if (status === 'completed' || status === 'approved' || status === 'approved') {
            return (
                <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl flex items-center gap-4 text-left shadow-lg">
                    <div className="bg-gradient-to-b from-green-100 to-emerald-100 p-3 rounded-full text-green-600 flex-shrink-0"><CheckCircle className="w-7 h-7" /></div>
                    <div className="flex-1">
                        <h4 className="font-black text-green-900 text-lg">✓ Valid Certificate</h4>
                        <p className="text-sm text-green-700 font-semibold mt-1">Issued to: <strong>{result.issued_to}</strong></p>
                        <p className="text-xs text-green-600 mt-1">Service: {result.service_type || '—'} • Issued on: {result.issued_on || '—'}</p>
                    </div>
                </div>
            );
        }

        if (status === 'rejected' || status === 'revoke' || status === 'rejected') {
            return (
                <div className="mt-10 p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-4 text-left shadow-lg">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 flex-shrink-0"><XCircle className="w-7 h-7" /></div>
                    <div className="flex-1">
                        <h4 className="font-black text-red-900 text-lg">Certificate Not Valid</h4>
                        <p className="text-sm text-red-700 font-semibold mt-1">This certificate was rejected or is not valid.</p>
                        <p className="text-xs text-red-600 mt-1">Reference: {result.application_id}</p>
                    </div>
                </div>
            );
        }

        // Default: pending
        return (
            <div className="mt-10 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-center gap-4 text-left shadow-lg">
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 flex-shrink-0"><Clock className="w-7 h-7" /></div>
                <div className="flex-1">
                    <h4 className="font-black text-yellow-900 text-lg">Verification Pending</h4>
                    <p className="text-sm text-yellow-700 font-semibold mt-1">The certificate is still being processed. Please check back later.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-semibold transition">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
        
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-blue-100">
                        <div className="w-20 h-20 bg-gradient-to-b from-blue-100 to-indigo-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <ShieldCheck className="w-10 h-10" />
                        </div>
            
                        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Document Verification</h1>
                        <p className="text-gray-600 mb-10 font-semibold text-lg">Enter the Certificate ID or Scan QR Code to verify authenticity.</p>

                        <form onSubmit={handleVerify} className="relative max-w-md mx-auto mb-10">
                                <input 
                                        type="text" 
                                        value={docId}
                                        onChange={(e) => setDocId(e.target.value)}
                                        placeholder="Enter Certificate ID (e.g. 693f9a8119eea29de518dafa)"
                                        className="w-full pl-6 pr-16 py-4 border-2 border-blue-200 rounded-2xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300 bg-white"
                                />
                                <button disabled={loading} type="submit" className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 rounded-xl hover:shadow-lg transition font-bold flex items-center gap-2">
                                        <Search className="w-5 h-5" /> {loading ? 'Checking...' : 'Check'}
                                </button>
                        </form>

                        <div className="flex items-center justify-center gap-6 text-sm text-gray-700 font-semibold">
                                <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg"><ScanLine className="w-4 h-4 text-blue-600"/> QR Scan Supported</span>
                                <span className="text-gray-300">•</span>
                                <span className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">⚡ Real-time Database</span>
                        </div>

                        {error && (
                            <div className="mt-6 text-sm text-red-600 font-semibold">{error}</div>
                        )}

                        {renderStatusCard()}
                </div>
            </div>
        </div>
    );
}