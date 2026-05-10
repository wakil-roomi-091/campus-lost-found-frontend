// client/src/components/auth/GoogleLoginButton.js
import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Use this exact URL
    window.location.href =
      "http://https://web-production-c29aa.up.railway.app/api/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
