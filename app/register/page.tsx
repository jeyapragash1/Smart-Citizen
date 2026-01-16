'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirection
import { User, Phone, Lock, Eye, EyeOff, ShieldAlert, Smartphone, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { registerUser } from '@/lib/api'; // Import our new API helper

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullname: '',
    nic: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Send data to Backend
      await registerUser(formData);
      
      // 2. If successful, store NIC and redirect to OTP verification
      sessionStorage.setItem('registration_nic', formData.nic);
      router.push('/verify-otp');
    } catch (err: any) {
      // 3. If error, show message
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                SL
            </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your Digital ID
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          One account for all Sri Lankan government services.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ShieldAlert className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Ensure your <strong>Name</strong> matches your NIC exactly.
                        </p>
                    </div>
                </div>
            </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input name="fullname" onChange={handleChange} required type="text" className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Saman Perera" />
              </div>
            </div>

            {/* NIC & Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">NIC Number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input name="nic" onChange={handleChange} required type="text" className="block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="1990xxxxxxV" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Smartphone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input name="phone" onChange={handleChange} required type="tel" className="block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="077xxxxxxx" />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input name="email" onChange={handleChange} type="email" className="block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="saman@example.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Register Account'}
              </button>
            </div>
          </form>
          
           <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Already have an ID? </span>
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium flex items-center justify-center gap-1 mt-2">
                Sign in here <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

        </div>
      </div>
    </div>
  );
}