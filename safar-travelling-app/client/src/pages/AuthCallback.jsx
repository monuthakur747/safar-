import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Confirming your email...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash;

        // Supabase automatically handles the callback
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data?.session) {
          setIsSuccess(true);
          setMessage("Email confirmed successfully! Redirecting...");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setMessage("Email confirmed! You can now log in.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Callback error:", error);
        setMessage("Error confirming email. Please try again.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            {isSuccess ? (
              <div className="text-4xl">✓</div>
            ) : (
              <div className="inline-block animate-spin">
                <span className="text-4xl">✈️</span>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{message}</h2>
          <div className="w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
