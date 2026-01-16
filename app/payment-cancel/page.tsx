'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Get order ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('order_id');
    if (id) {
      setOrderId(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Title and Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been cancelled. Your order is still saved and you can complete the payment anytime.
          </p>

          {/* Order Info */}
          {orderId && (
            <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
              <p className="text-gray-600 text-sm mb-1">Order ID</p>
              <p className="text-red-600 font-bold text-lg">{orderId}</p>
            </div>
          )}

          {/* What You Can Do */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">What You Can Do?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">→</span>
                <span>Try a different payment method</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">→</span>
                <span>Try the payment again</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">→</span>
                <span>Use Cash on Delivery (COD) instead</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">→</span>
                <span>Contact support for assistance</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link href="/checkout">
              <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
                Return to Checkout
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
            <p className="mt-2 text-xs">Available 24/7 for assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
