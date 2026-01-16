'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { sendOTP, verifyOTP } from '@/lib/api';

export default function OTPVerification() {
  const router = useRouter();
  const [step, setStep] = useState<'method' | 'otp'>('method');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [otp, setOtp] = useState('');
  const [nic, setNic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [maskedContact, setMaskedContact] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, step]);

  // Get NIC and contact method from sessionStorage or redirect
  useEffect(() => {
    const storedNic = sessionStorage.getItem('registration_nic');
    const storedMethod = sessionStorage.getItem('otp_method') as 'email' | 'phone' | null;

    if (!storedNic) {
      router.push('/register');
      return;
    }

    setNic(storedNic);
    if (storedMethod) {
      setContactMethod(storedMethod);
      setStep('otp');
    }
  }, [router]);

  // Send OTP
  const handleSendOtp = async () => {
    if (!nic) {
      setError('NIC is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await sendOTP(nic, contactMethod);
      
      setMaskedContact(data.masked_contact);
      sessionStorage.setItem('otp_method', contactMethod);
      sessionStorage.setItem('registration_nic', nic);
      setStep('otp');
      setTimeLeft(600);
      setSuccess(`OTP sent to ${data.masked_contact}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(nic, otp);
      
      setSuccess('✅ Verification successful! Redirecting to login...');
      sessionStorage.removeItem('registration_nic');
      sessionStorage.removeItem('otp_method');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setAttempts(attempts + 1);
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp('');
    setAttempts(0);
    await handleSendOtp();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🔐 Verify Account</h1>
          <p className="text-gray-600 mt-2">Secure your Smart Citizen account</p>
        </div>

        {/* Step 1: Choose Contact Method */}
        {step === 'method' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              How would you like to receive your OTP?
            </label>

            <button
              onClick={() => setContactMethod('email')}
              className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                contactMethod === 'email'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Mail className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Email</p>
                <p className="text-xs text-gray-500">Faster and safer</p>
              </div>
            </button>

            <button
              onClick={() => setContactMethod('phone')}
              className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                contactMethod === 'phone'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Phone className="w-5 h-5 text-green-500" />
              <div className="text-left">
                <p className="font-medium">Phone (SMS)</p>
                <p className="text-xs text-gray-500">Get OTP via SMS</p>
              </div>
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Enter your NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading || !nic}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Back to <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </p>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                OTP sent to <span className="font-semibold">{maskedContact}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : 'OTP Expired'}
                </span>
              </div>
              {timeLeft <= 0 && (
                <button
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Resend
                </button>
              )}
            </div>

            {/* Attempts warning */}
            {attempts > 3 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                ⚠️ {5 - attempts} attempts remaining
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6 || timeLeft <= 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              onClick={() => {
                setStep('method');
                setOtp('');
                setError('');
              }}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2"
            >
              Change contact method
            </button>

            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full text-gray-600 hover:text-gray-700 font-medium py-2 disabled:text-gray-400"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Your security is our priority</p>
          <p>🔒 All data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
