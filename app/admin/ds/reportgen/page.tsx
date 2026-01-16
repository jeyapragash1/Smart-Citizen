'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { generateReport } from '@/lib/api';

export default function DSReportGeneratorPage() {
  const [reportType, setReportType] = useState('monthly');
  const [month, setMonth] = useState('2025-12');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const [year, monthNum] = month.split('-');
      const result = await generateReport({ report_type: reportType.charAt(0).toUpperCase() + reportType.slice(1), month: parseInt(monthNum), year: parseInt(year), include_metrics: true });
      setMessage(`Report ${result.report_id} generated successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Report generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Generator</h1>
          <p className="text-sm text-gray-600">Export monthly/annual reports (PDF/Excel)</p>
        </div>
      </div>

      {message && <div className={`${message.includes('successfully') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'} px-4 py-3 rounded-lg flex items-center gap-2`}><AlertCircle size={16} /> {message}</div>}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="monthly">Monthly Report</option>
            <option value="quarterly">Quarterly Report</option>
            <option value="annual">Annual Report</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month/Year</label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <button onClick={handleGenerateReport} disabled={loading} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
          <Download size={16} /> {loading ? 'Generating...' : 'Generate & Download'}
        </button>
      </div>
    </div>
  );
}
