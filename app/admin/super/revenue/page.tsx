'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';
import { getRevenueAnalytics } from '@/lib/api';

export default function RevenuePage() {
  const [data, setData] = useState({ total_revenue: 0, breakdown: [] });

  useEffect(() => {
    getRevenueAnalytics().then(setData);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">National Revenue Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-6 text-white shadow-lg relative">
            <p className="text-green-100 font-medium mb-1">Total Revenue (Collected)</p>
            <h2 className="text-4xl font-bold mb-4">LKR {data.total_revenue.toLocaleString()}</h2>
            <DollarSign className="absolute right-4 top-4 text-white/20 w-24 h-24" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6">Service Breakdown</h3>
        <div className="space-y-4">
            {data.breakdown.map((item: any, idx) => (
                <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{item.service}</span>
                        <span className="font-bold text-gray-900">LKR {item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                </div>
            ))}
            {data.breakdown.length === 0 && <p className="text-gray-500">No revenue data available yet.</p>}
        </div>
      </div>
    </div>
  );
}