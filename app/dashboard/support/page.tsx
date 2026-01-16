'use client';

import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, HelpCircle, Send, Clock, MapPin, Globe } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend API
    console.log('Support request:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
    }, 3000);
  };

  const faqs = [
    {
      question: 'How long does it take to process my application?',
      answer: 'Processing times vary by service type. Birth certificates typically take 5-7 business days, police clearances take 10-14 days, and grama certificates take 3-5 days.'
    },
    {
      question: 'Can I track my application status?',
      answer: 'Yes! Go to "My Applications" in your dashboard to view real-time status updates for all your applications.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, bank transfers, and digital wallet payments for all services.'
    },
    {
      question: 'How do I download my certificate?',
      answer: 'Once your application is approved and marked as "Completed", you can download your certificate from the "My Applications" page by clicking the download button.'
    },
    {
      question: 'Can I cancel or modify my application?',
      answer: 'Yes, you can withdraw pending applications from your dashboard. However, applications already in review cannot be modified.'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📞 Support & Help</h1>
        <p className="text-gray-600 mt-1">We're here to help you with any questions or issues</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <Phone size={32} className="mb-4" />
          <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
          <p className="text-blue-100 text-sm mb-3">Available Mon-Fri, 9AM-5PM</p>
          <a href="tel:+94112345678" className="text-white font-mono text-lg hover:underline">
            +94 11 234 5678
          </a>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <Mail size={32} className="mb-4" />
          <h3 className="font-semibold text-lg mb-2">Email Support</h3>
          <p className="text-green-100 text-sm mb-3">Response within 24 hours</p>
          <a href="mailto:support@smartcitizen.lk" className="text-white hover:underline break-all">
            support@smartcitizen.lk
          </a>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <MessageCircle size={32} className="mb-4" />
          <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
          <p className="text-purple-100 text-sm mb-3">Instant assistance available</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition">
            Start Chat
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Send size={24} className="text-blue-600" />
            Submit a Support Request
          </h2>

          {submitted && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              ✅ Your support request has been submitted! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Issue</option>
                <option value="payment">Payment Problem</option>
                <option value="application">Application Status</option>
                <option value="account">Account Issues</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit Request
            </button>
          </form>
        </div>

        {/* FAQs and Office Info */}
        <div className="space-y-6">
          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle size={24} className="text-blue-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600 transition list-none flex items-start gap-2">
                    <span className="text-blue-600 mt-1">❓</span>
                    <span>{faq.question}</span>
                  </summary>
                  <p className="mt-2 ml-7 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Office Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Office Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Main Office</p>
                  <p className="text-sm text-gray-600">
                    No. 123, Galle Road<br />
                    Colombo 03, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Working Hours</p>
                  <p className="text-sm text-gray-600">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM<br />
                    Sunday & Public Holidays: Closed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Website</p>
                  <a href="https://smartcitizen.lk" className="text-sm text-blue-600 hover:underline">
                    www.smartcitizen.lk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
