'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentPage() {
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
        console.log('Payment page loaded, order ID:', orderId);

        // First, debug check if order exists
        try {
          const debugResponse = await fetch(`http://127.0.0.1:8000/api/payhere/debug/${orderId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const debugData = await debugResponse.json();
          console.log('DEBUG order check:', debugData);
        } catch (debugErr) {
          console.warn('Debug check failed:', debugErr);
        }

        // Get user details from localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : { nic: '', email: '', full_name: '' };

        // Get order details from localStorage (or we could fetch from API)
        const cartStr = localStorage.getItem('cart');
        const cart = cartStr ? JSON.parse(cartStr) : [];

        const subtotal = cart.reduce((sum: number, item: any) => sum + item.total, 0);
        const shipping = 500;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;

        const paymentInitData = {
          order_id: orderId,
          amount: total,
          customer_name: user.full_name || 'Customer',
          customer_email: user.email || '',
          customer_phone: localStorage.getItem('checkout_phone') || '',
          delivery_address: localStorage.getItem('checkout_address') || '',
        };

        console.log('Initializing PayHere payment with:', paymentInitData);

        // Wait longer for the order to be written to the database with retry logic
        let response;
        let retries = 3;
        let lastError = null;

        while (retries > 0) {
          try {
            // Wait 2 seconds before attempting
            await new Promise(resolve => setTimeout(resolve, 2000));

            response = await fetch('http://127.0.0.1:8000/api/payhere/initialize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(paymentInitData),
            });

            if (response.ok) {
              // Success, break the retry loop
              break;
            }

            const errorData = await response.json();
            lastError = errorData.detail || `Payment initialization failed: ${response.status}`;
            console.log(`Attempt ${4 - retries} failed: ${lastError}. Retrying...`);
            
            retries--;
            if (retries === 0) {
              throw new Error(lastError);
            }
          } catch (err: any) {
            lastError = err.message;
            retries--;
            if (retries === 0) {
              throw err;
            }
            console.log(`Attempt ${4 - retries} failed: ${err.message}. Retrying...`);
          }
        }

        if (!response!.ok) {
          throw new Error(lastError);
        }

        const html = await response!.text();

        // Write the HTML response directly to the page
        document.open();
        document.write(html);
        document.close();
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
