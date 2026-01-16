'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get order ID from URL or session
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    
    if (orderId) {
      // Optionally fetch order details
      setOrderDetails({ order_id: orderId });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title and Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your order has been confirmed and is being processed.
          </p>

          {/* Order Details */}
          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <p className="text-gray-600 text-sm mb-1">Order ID</p>
            <p className="text-green-600 font-bold text-lg">{orderDetails?.order_id || 'ORD-XXXXXXXX'}</p>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>You will receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Your order will be prepared for shipment</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Track your order status anytime from your dashboard</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link href="/orders">
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                View My Orders
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Go to Dashboard
              </button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p className="mb-2">Need help? Contact our support team</p>
            <p className="font-semibold">support@smartcitizen.lk</p>
          </div>
        </div>
      </div>
    </div>
  );
}
