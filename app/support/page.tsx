'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft, Phone, Mail, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password'. You will receive an OTP to your registered mobile." },
    { q: "How long does it take to get a Birth Certificate?", a: "Digital copies are issued instantly. Physical copies take 3-5 working days via post." },
    { q: "Is my data secure?", a: "Yes. SmartCitizen uses government-grade encryption and adheres to the Personal Data Protection Act of Sri Lanka." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
            <p className="text-gray-600">Search our knowledge base or contact a government agent.</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900">Call Center</h3>
                <p className="text-blue-600 font-bold text-xl mt-2">1919</p>
                <p className="text-xs text-gray-500 mt-1">Available 24/7 (Trilingual)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900">Live Chat</h3>
                <p className="text-green-600 font-bold mt-2">Start Chat</p>
                <p className="text-xs text-gray-500 mt-1">Wait time: ~2 mins</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900">Email Support</h3>
                <p className="text-gray-600 font-medium mt-2">help@gov.lk</p>
                <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
            </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600"/> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {faqs.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}