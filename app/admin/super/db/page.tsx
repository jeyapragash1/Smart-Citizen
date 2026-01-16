'use client';

import React from 'react';
import { Database, RefreshCw, Save } from 'lucide-react';

export default function AdminDBPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Configuration</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Database size={18} className="text-blue-600"/> Connection Settings
        </h3>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MongoDB URI</label>
                <input type="password" value="mongodb+srv://admin:********@cluster0.gov.lk" readOnly className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-mono text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Replica Set Name</label>
                <input type="text" value="rs0-gov-prod" readOnly className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-mono text-sm" />
            </div>
            
            <div className="flex items-center gap-2 pt-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm font-bold text-green-700">Connected to Primary Node</span>
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
            <RefreshCw size={18} /> Backup Now
        </button>
        <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300">
            View Snapshots
        </button>
      </div>
    </div>
  );
}