import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailNotConfirmedError, setEmailNotConfirmedError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailNotConfirmedError(false);
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        // Check if the error is about email not confirmed
        if (signInError.message.includes("Email not confirmed")) {
          setEmailNotConfirmedError(true);
          setError(null);
        } else {
          setError(signInError.message);
        }
      } else if (data?.session) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

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
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Password Field */}
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

            {/* Error Messages */}
            {emailNotConfirmedError && (
              <div className="text-red-500 text-sm font-medium">
                Email not confirmed
              </div>
            )}
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            {/* Resend Confirmation */}
            {emailNotConfirmedError && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Check your email for a confirmation link. Didn't receive it?{" "}
                  <Link
                    to="/resend-confirmation"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Resend
                  </Link>
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Logging in..." : "Login"}
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
