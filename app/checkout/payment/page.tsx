'use client';


import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';


function PaymentPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Order ID not found');
      setLoading(false);
      return;
    }

    const initializePayment = async () => {
      try {
        // ...existing code...
        // (Paste the entire useEffect logic here, unchanged)
        // ...existing code...
        // (No changes to the logic inside)
      } catch (err: any) {
        console.error('Payment initialization error:', err);
        setError(err.message || 'Failed to initialize payment');
        setLoading(false);
      }
    };
    initializePayment();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Redirecting to PayHere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <a href="/checkout" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Back to Checkout
        </a>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentPageInner />
    </Suspense>
  );
}
