'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-700 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                <Lock className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-500 text-sm">Effective Date: December 13, 2025</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 md:p-12 text-gray-700 leading-relaxed">
            
          {/* Highlight Box */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-8 flex items-start gap-4">
             <Server className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
             <div>
                <h3 className="font-bold text-blue-900">Data Sovereignty</h3>
                <p className="text-sm text-blue-800 mt-1">
                    All citizen data is stored securely within the geographical borders of Sri Lanka in the Government Cloud (Lanka Government Cloud - LGC). We do not sell your data to third parties.
                </p>
             </div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="mb-2">To provide digital services, we collect and verify the following:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Identity:</strong> Full Name, NIC Number, Date of Birth.</li>
              <li><strong>Contact Details:</strong> Mobile Number, Email Address, Residential Address.</li>
              <li><strong>Biometrics:</strong> Fingerprints/Facial data (only during high-security verifications).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Data</h2>
            <p className="mb-4">
              Your data is used strictly for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verifying your identity for government services (e.g., Passport issuance).</li>
              <li>Pre-filling forms to save you time.</li>
              <li><strong>Smart Recommendations:</strong> If you opt-in, we analyze life events (like marriage registration) to suggest relevant services. You can turn this off at any time.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Data Sharing</h2>
            <p className="mb-4">
              We share data <strong>only</strong> between relevant Government Departments (e.g., Department of Motor Traffic may check NIC details with the Department of Registration of Persons).
            </p>
            <p>
              We do <strong>not</strong> share data with private companies unless you explicitly authorize a transaction (e.g., applying for a bank loan via the platform).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Security Measures</h2>
            <p className="mb-4">
              We employ military-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Access to your data by government officers is strictly logged and audited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="mb-4">
              Under the <em>Personal Data Protection Act No. 9 of 2022</em>, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
               <li>Request a copy of all data we hold about you.</li>
               <li>Request corrections to inaccurate data.</li>
               <li>Withdraw consent for optional services (like marketing suggestions).</li>
            </ul>
          </section>

          <div className="border-t border-gray-100 pt-8 mt-8">
            <p className="text-sm text-gray-500">
              For privacy concerns, contact the Data Protection Officer: <br />
              <span className="font-semibold text-gray-900">dpo@smartcitizen.gov.lk</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}