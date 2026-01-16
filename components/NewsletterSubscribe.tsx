"use client";

import React, { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<null | 'idle' | 'loading' | 'success' | 'error'>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email');
      return;
    }
    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email.trim());
      setStatus('success');
      setMessage(res.message || 'Subscribed!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Subscription failed');
    }
  };

  return (
    <div className="mt-12 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h4 className="text-lg font-bold text-gray-900 mb-2">Get Exclusive Deals</h4>
      <p className="text-sm text-gray-600 mb-4">Subscribe for special offers, early access to new products & exclusive discounts.</p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="✉️ Enter your email..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none"
        />
        <button disabled={status==='loading'} className="px-4 py-3 bg-blue-700 text-white rounded-xl font-semibold">
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-3">🔒 We respect your privacy. Unsubscribe anytime.</p>
      {message && <div className={`mt-3 text-sm ${status==='success' ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
    </div>
  );
}
