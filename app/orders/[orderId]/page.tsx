'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrderDetails, cancelOrder } from '@/lib/api';

interface TrackingHistory {
  status: string;
  message: string;
  timestamp: string;
  updated_by: string;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  _id: string;
  order_id: string;
  customer_nic: string;
  items: OrderItem[];
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  delivery_address: string;
  phone: string;
  created_at: string;
  tracking_history: TrackingHistory[];
}

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  Processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' },
  Confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '✓' },
  Shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '📦' },
  Delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: '✕' },
};

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    setError('');

    try {
      const result = await cancelOrder(orderId);
      setSuccess('✅ Order cancelled successfully');
      setOrder(result);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            <p className="font-semibold text-lg mb-2">Error</p>
            <p>{error}</p>
          </div>
          <Link href="/orders">
            <button className="mt-6 text-blue-600 hover:underline">← Back to Orders</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusColor = statusColors[order.order_status] || statusColors.Processing;
  const canCancel = ['Processing', 'Confirmed'].includes(order.order_status);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            <Link href="/orders" className="text-blue-600 hover:underline">
              ← Back to Orders
            </Link>
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Tracking</h1>
          <p className="text-gray-600">Order ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{order.order_id}</span></p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className={`${statusColor.bg} ${statusColor.text} rounded-lg p-8 border-2`}>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{statusColor.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold">{order.order_status}</h2>
                  <p className="text-sm opacity-90">
                    {order.order_status === 'Delivered' && 'Your order has been delivered'}
                    {order.order_status === 'Shipped' && 'Your order is on the way'}
                    {order.order_status === 'Confirmed' && 'Your order has been confirmed'}
                    {order.order_status === 'Processing' && 'Your order is being processed'}
                    {order.order_status === 'Cancelled' && 'This order has been cancelled'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Tracking Timeline</h3>
              <div className="space-y-6">
                {order.tracking_history && order.tracking_history.length > 0 ? (
                  order.tracking_history.map((entry, index) => {
                    const entryColor = statusColors[entry.status] || statusColors.Processing;
                    const isLast = index === order.tracking_history.length - 1;

                    return (
                      <div key={index} className="flex gap-6">
                        {/* Timeline Dot */}
                        <div className="flex flex-col items-center">
                          <div className={`${entryColor.bg} ${entryColor.text} w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg`}>
                            {entryColor.icon}
                          </div>
                          {!isLast && <div className="w-1 h-16 bg-gray-300 mt-2"></div>}
                        </div>

                        {/* Timeline Content */}
                        <div className="flex-1 pb-6">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 text-lg">{entry.status}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(entry.timestamp).toLocaleString('en-LK')}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{entry.message}</p>
                          {entry.updated_by && (
                            <p className="text-sm text-gray-500">Updated by: {entry.updated_by}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No tracking history available</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.product_name}</h4>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        Rs. {item.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Rs. {item.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Details</h3>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.created_at).toLocaleDateString('en-LK')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Method</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {order.payment_method.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <p className={`font-semibold ${order.payment_status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.payment_status}
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <h4 className="font-bold text-gray-800">Delivery Address</h4>
                <p className="text-gray-600 text-sm">{order.delivery_address}</p>
                <p className="text-gray-600 text-sm">Phone: {order.phone}</p>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-gray-800 text-lg">
                    Rs. {order.total_amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Cancel Button */}
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}

              {!canCancel && (
                <p className="text-sm text-gray-500 text-center p-2 bg-gray-100 rounded">
                  Cannot cancel {order.order_status.toLowerCase()} orders
                </p>
              )}

              {/* Contact Support */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700">
                <p className="font-semibold mb-1">📞 Need Help?</p>
                <p>Contact support@smartcitizen.lk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
