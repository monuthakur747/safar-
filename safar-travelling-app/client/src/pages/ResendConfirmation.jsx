import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ResendConfirmation() {
  const { resendConfirmationEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error: resendError } = await resendConfirmationEmail(email);

      if (resendError) {
        setError(resendError.message);
      } else {
        setMessage(`Confirmation email sent to ${email}. Please check your inbox.`);
        setEmail("");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
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

        {/* Resend Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Resend Confirmation</h2>
          <p className="text-gray-600 mb-6">
            Enter your email to receive a new confirmation link
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

            {/* Messages */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Sending..." : "Resend Confirmation"}
            </button>
          </form>

          {/* Back to Login Link */}
          <p className="text-center text-gray-600 mt-6">
            <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
