'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { loginUser } from '@/lib/api'; // Import the API helper

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Send Login Request to Backend
      const data = await loginUser({ nic, password });
      
      // 2. Save Token & User Info to Browser Storage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.name);

      // 3. Smart Redirect based on Role
      if (data.role === 'citizen') {
        router.push('/dashboard');
      } else if (data.role === 'gs') {
        router.push('/admin/gs');
      } else if (data.role === 'ds') {
        router.push('/admin/ds');
      } else if (data.role === 'admin') {
        router.push('/admin/super');
      } else {
        router.push('/dashboard'); // Default fallback
      }

    } catch (err: any) {
      // Check if error is about unverified account
      if (err.message.includes('not verified')) {
        setError('Your account is not verified yet. Please verify your email/phone first.');
        setTimeout(() => {
          sessionStorage.setItem('registration_nic', nic);
          router.push('/verify-otp');
        }, 2000);
      } else {
        setError(err.message || "Invalid NIC or Password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                SL
            </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to SmartCitizen
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Use your National Identity Card (NIC) number
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          {/* Error Alert */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm animate-pulse">
              <p className="font-bold">Login Failed</p>
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* NIC Field */}
            <div>
              <label htmlFor="nic" className="block text-sm font-medium text-gray-700">
                NIC Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nic"
                  type="text"
                  required
                  placeholder="e.g. 1990xxxxxxV"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to SmartCitizen?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium flex items-center justify-center gap-1">
                Create an account <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          </div>
        </div>
        
        <Link href="/" className="mt-8 flex justify-center items-center text-gray-500 hover:text-gray-900 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1"/> Back to Home
        </Link>
      </div>
    </div>
  );
}