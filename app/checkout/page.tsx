'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrder } from '@/lib/api';

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

interface FormData {
  delivery_address: string;
  phone: string;
  payment_method: 'card' | 'cash_on_delivery' | 'bank_transfer' | 'payhere';
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormData>({
    delivery_address: '',
    phone: '',
    payment_method: 'cash_on_delivery',
  });

  // Load cart from localStorage
  useEffect(() => {
    // Load immediately when component mounts
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const updatedCart = localStorage.getItem('cart');
        if (updatedCart) {
          try {
            setCart(JSON.parse(updatedCart));
          } catch (e) {
            console.error('Failed to parse cart:', e);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!formData.delivery_address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    if (!formData.phone.trim() || !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart,
        delivery_address: formData.delivery_address,
        phone: formData.phone,
        payment_method: formData.payment_method,
      };

      const result = await createOrder(orderData);

      // If PayHere payment method is selected, redirect to payment page
      if (formData.payment_method === 'payhere') {
        // Save phone and address for the payment page
        localStorage.setItem('checkout_phone', formData.phone);
        localStorage.setItem('checkout_address', formData.delivery_address);
        
        // Redirect to the payment initialization page with order ID
        window.location.href = `/checkout/payment?order_id=${result.order_id}`;
        return;
      }

      setSuccess(`✅ Order placed successfully! Order ID: ${result.order_id}`);
      setCart([]);
      localStorage.removeItem('cart');

      // Redirect to order history after 2 seconds
      setTimeout(() => {
        router.push(`/orders/${result.order_id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">
            <Link href="/marketplace" className="text-blue-600 hover:underline">
              ← Back to Marketplace
            </Link>
          </p>
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

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link href="/marketplace">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow-md p-8 space-y-6">
                {/* Delivery Address */}
                <div>
                  <label htmlFor="delivery_address" className="block text-gray-700 font-semibold mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    id="delivery_address"
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter complete delivery address (Street, City, Postal Code)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">Format: 0712345678</p>
                </div>

                {/* Payment Method */}
                <div>
                  <label htmlFor="payment_method" className="block text-gray-700 font-semibold mb-2">
                    Payment Method *
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash_on_delivery">💵 Cash on Delivery (COD)</option>
                    <option value="payhere">🔒 PayHere (Online Payment)</option>
                    <option value="card">💳 Debit/Credit Card</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                  </select>
                  <p className="text-gray-500 text-sm mt-2">
                    {formData.payment_method === 'cash_on_delivery' && 'Pay when your order is delivered'}
                    {formData.payment_method === 'payhere' && 'Secure online payment through PayHere'}
                    {formData.payment_method === 'card' && 'Secure online card payment'}
                    {formData.payment_method === 'bank_transfer' && 'Direct bank transfer'}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Place Order (Rs. ${total.toLocaleString('en-LK', { minimumFractionDigits: 2 })})`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

                {/* Items List */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex justify-between text-sm border-b border-gray-200 pb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{item.product_name}</p>
                        <p className="text-gray-600">x{item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        Rs. {item.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>Rs. {shipping.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%):</span>
                    <span>Rs. {tax.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-800">
                    <span>Total:</span>
                    <span>Rs. {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700">
                  <p className="font-semibold mb-1">ℹ️ Need Help?</p>
                  <p>Contact our support team at support@smartcitizen.lk</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
