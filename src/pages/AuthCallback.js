// client/src/pages/AuthCallback.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const role = urlParams.get("role");

    console.log("🔐 AuthCallback - Token received:", !!token);
    console.log("🔐 AuthCallback - Role:", role);

    if (token && userId) {
      // Prepare user data object
      const userData = {
        id: userId,
        name: decodeURIComponent(name || ""),
        email: email || "",
        role: role || "user",
        profilePicture: "",
        coverPhoto: "",
        bio: "",
        location: "",
        phone: "",
        socialLinks: {},
      };

      console.log("✅ Calling googleLogin with user data:", userData);

      // Use the context method (which now uses sessionStorage)
      googleLogin(userData, token);

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      console.error("❌ Missing token or userId");
      setError("Authentication failed. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [googleLogin, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-8 text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-white font-semibold mb-2">
            Authentication Error
          </h3>
          <p className="text-gray-400">{error}</p>
          <p className="text-gray-500 text-sm mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-white">
          Completing login...
        </h2>
        <p className="text-gray-400 text-sm mt-2">Please wait</p>
      </div>
    </div>
  );
};

export default AuthCallback;
