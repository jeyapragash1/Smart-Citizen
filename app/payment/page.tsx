'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  QrCode, 
  Landmark, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'card' | 'qr' | 'bank'>('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Payment Processing Time (2 seconds)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleFinish = () => {
    router.push('/dashboard/applications');
  };

  // ============================
  // SUCCESS STATE (Receipt)
  // ============================
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-t-4 border-green-500 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-6">Transaction Ref: <span className="font-mono text-gray-800">TXN-{Math.floor(Math.random()*100000)}</span></p>
          
          <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left space-y-2">
            <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Amount Paid</span>
                <span className="font-bold text-gray-900">LKR 1,500.00</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Date</span>
                <span className="font-medium text-gray-900">Dec 13, 2025</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Status</span>
                <span className="text-green-600 font-bold text-sm">COMPLETED</span>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // PAYMENT FORM
  // ============================
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left: Order Summary */}
        <div className="md:w-1/3 space-y-6">
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-4">
                <ArrowLeft size={16} className="mr-1"/> Cancel Transaction
            </button>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Order Summary</h3>
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <ShieldCheck size={24}/>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Gov Service Fee</h4>
                        <p className="text-xs text-gray-500">Birth Certificate Application</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">1,450.00</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-medium">50.00</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="font-bold text-lg text-gray-900">Total</span>
                    <span className="font-bold text-2xl text-blue-700">LKR 1,500.00</span>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3 border border-blue-100 text-blue-800 text-sm">
                <Lock size={18} />
                <p>Payments are secured with 256-bit SSL encryption via PayHere.</p>
            </div>
        </div>

        {/* Right: Payment Method */}
        <div className="md:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button 
                        onClick={() => setMethod('card')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${method === 'card' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <CreditCard size={18} /> Card Payment
                    </button>
                    <button 
                        onClick={() => setMethod('qr')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${method === 'qr' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <QrCode size={18} /> LankaQR
                    </button>
                    <button 
                        onClick={() => setMethod('bank')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${method === 'bank' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Landmark size={18} /> Bank Transfer
                    </button>
                </div>

                {/* Card Form */}
                {method === 'card' && (
                    <form onSubmit={handlePay} className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Expiry Date</label>
                                <input required type="text" placeholder="MM / YY" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-center" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CVV / CVC</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <input required type="password" placeholder="123" maxLength={3} className="w-full pl-9 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cardholder Name</label>
                            <input required type="text" placeholder="Saman Perera" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Pay LKR 1,500.00'}
                        </button>
                    </form>
                )}

                {/* LankaQR View */}
                {method === 'qr' && (
                    <div className="p-8 text-center flex flex-col items-center">
                        <p className="text-sm text-gray-600 mb-4">Scan using any Sri Lankan Banking App (BOC, Peoples, ComBank, etc.)</p>
                        <div className="border-4 border-gray-900 rounded-xl p-2 mb-6">
                            {/* Simple CSS QR Placeholder */}
                            <div className="w-48 h-48 bg-gray-900 flex items-center justify-center text-white">
                                <QrCode size={100} />
                            </div>
                        </div>
                        <p className="text-xs text-red-500 font-bold animate-pulse mb-6">Time remaining: 04:59</p>
                        <button onClick={handlePay} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black">
                            I have Scanned & Paid
                        </button>
                    </div>
                )}
                 
                 {/* Bank Transfer View */}
                 {method === 'bank' && (
                    <div className="p-8 space-y-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 mb-4">
                            Please upload the deposit slip after transferring funds to the account below.
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm space-y-2">
                            <p><strong>Bank:</strong> Bank of Ceylon</p>
                            <p><strong>Account Name:</strong> Govt Revenue Dept</p>
                            <p><strong>Account No:</strong> 000-1234-5678</p>
                            <p><strong>Branch:</strong> Taprobane</p>
                        </div>
                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition">
                            <p className="text-gray-500">Click to upload Receipt / Slip</p>
                         </div>
                         <button onClick={handlePay} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                            Submit for Verification
                        </button>
                    </div>
                 )}

            </div>
        </div>

      </div>
    </div>
  );
}