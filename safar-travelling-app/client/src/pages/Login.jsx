import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { requestLoginOTP, verifyLoginOTP } = useAuth();
  
  // Step 1: Email input
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Step 2: OTP verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const { error: otpError } = await requestLoginOTP(email);

      if (otpError) {
        setError(otpError.message);
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError(err.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      const { error: verifyError } = await verifyLoginOTP(email, otp);

      if (verifyError) {
        setError(verifyError.message);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // OTP verification screen
  if (otpSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">✈️</span>
              <h1 className="text-3xl font-bold text-orange-600">Safar</h1>
            </div>
          </div>

          {/* OTP Verification Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
            <p className="text-gray-600 mb-6">
              We've sent a 6-digit OTP to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {/* OTP Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="000000"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  OTP expires in 10 minutes
                </p>
              </div>

              {/* Error Message */}
              {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                {loading ? "Verifying..." : "Login"}
              </button>
            </form>

            {/* Back Link */}
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError(null);
              }}
              className="w-full text-center text-orange-600 font-semibold hover:text-orange-700 mt-4"
            >
              Back to Enter Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email input screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">✈️</span>
            <h1 className="text-3xl font-bold text-orange-600">Safar</h1>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-6">
            Enter your email to receive an OTP
          </p>

          <form onSubmit={handleRequestOTP} className="space-y-4">
            {/* Email Field */}
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

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-600 font-semibold hover:text-orange-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
