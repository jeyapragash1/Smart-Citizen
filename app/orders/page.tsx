'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyOrders } from '@/lib/api';

interface Order {
  _id: string;
  order_id: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  items_count?: number;
}

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  Processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' },
  Confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '✓' },
  Shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '📦' },
  Delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: '✕' },
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.order_status === filter);

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.order_status === 'Processing').length,
    delivered: orders.filter(o => o.order_status === 'Delivered').length,
    cancelled: orders.filter(o => o.order_status === 'Cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-semibold">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm font-semibold">Processing</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.processing}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">Delivered</p>
              <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm font-semibold">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {!loading && orders.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            {['all', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-4">No orders yet</p>
            <Link href="/marketplace">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusColor = statusColors[order.order_status] || statusColors.Processing;
              return (
                <Link key={order._id} href={`/orders/${order.order_id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer border-l-4 border-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      {/* Order ID */}
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Order ID</p>
                        <p className="font-mono text-gray-800 font-bold">{order.order_id}</p>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Date</p>
                        <p className="text-gray-800">
                          {new Date(order.created_at).toLocaleDateString('en-LK')}
                        </p>
                      </div>

                      {/* Total */}
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total</p>
                        <p className="text-gray-800 font-bold">
                          Rs. {order.total_amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Status</p>
                        <div className={`${statusColor.bg} ${statusColor.text} inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mt-1`}>
                          <span>{statusColor.icon}</span>
                          <span>{order.order_status}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex justify-end">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No {filter} orders found</p>
          </div>
        )}

        {/* Continue Shopping Button */}
        {!loading && orders.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/marketplace">
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
