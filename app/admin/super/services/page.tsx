'use client';

import React, { useEffect, useState } from 'react';
import { Settings, ToggleRight, DollarSign, Clock, Save, CheckCircle, AlertCircle, X } from 'lucide-react';
import { getAllServices, updateServiceConfig } from '@/lib/api';

export default function ServiceConfigPage() {
  const [services, setServices] = useState<any[]>([]);

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
  };

  useEffect(() => {
    getAllServices().then(setServices);
  }, []);

  const handleUpdate = async (id: string, price: number, days: number, active: boolean) => {
    try {
        await updateServiceConfig(id, { price, days, active });
        showNotification('success', 'Configuration Saved!');
    } catch (e) { showNotification('error', 'Failed to save'); }
  };

  return (
    <div>
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <div>
              <p className="font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 hover:bg-white/20 p-1 rounded transition">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Configuration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc) => (
            <div key={svc._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900">{svc.name}</h3>
                        <p className="text-xs text-gray-500 uppercase">{svc.dept}</p>
                    </div>
                    <ToggleRight size={32} className={svc.active ? "text-green-600" : "text-gray-300"}/>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center gap-2"><DollarSign size={14}/> Fee (LKR)</span>
                        <input type="number" defaultValue={svc.price} onBlur={(e) => handleUpdate(svc._id, parseFloat(e.target.value), svc.days, svc.active)} className="w-24 text-right bg-white border border-gray-300 rounded px-2 py-1 text-sm font-bold" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center gap-2"><Clock size={14}/> SLA (Days)</span>
                        <input type="number" defaultValue={svc.days} onBlur={(e) => handleUpdate(svc._id, svc.price, parseInt(e.target.value), svc.active)} className="w-24 text-right bg-white border border-gray-300 rounded px-2 py-1 text-sm" />
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}