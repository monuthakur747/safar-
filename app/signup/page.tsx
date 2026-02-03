'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function SignUpPage() {
  const router = useRouter();
  const { requestSignupOTP, verifySignupOTP } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error: otpError } = await requestSignupOTP(email);

      if (otpError) {
        setError(otpError.message);
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);

    try {
      const { error: verifyError } = await verifySignupOTP(
        email,
        otp,
        password,
        confirmPassword
      );

      if (verifyError) {
        setError(verifyError.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">✈️</span>
              <h1 className="text-3xl font-bold text-orange-600">Safar</h1>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a 6-digit OTP to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="000000"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  OTP expires in 10 minutes
                </p>
              </div>

              {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setError(null);
              }}
              className="w-full text-center text-orange-600 font-semibold hover:text-orange-700 mt-4"
            >
              Back to Enter Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">✈️</span>
            <h1 className="text-3xl font-bold text-orange-600">Safar</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-6">
            Join Safar to discover amazing travel destinations
          </p>

          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
