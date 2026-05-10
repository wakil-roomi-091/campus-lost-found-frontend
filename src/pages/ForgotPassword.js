import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiSend,
  FiKey,
} from "react-icons/fi";
import axios from "axios";
import Navbar from "../components/layout/Navbar";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [timeLeft, setTimeLeft] = useState(0);

  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "http://https://web-production-c29aa.up.railway.app/api/password/forgot",
        { email },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: response.data.msg });
        setStep(2);
        setTimeLeft(300); // 5 minutes for OTP
      } else {
        setMessage({ type: "error", text: response.data.msg });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.msg || "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage({
        type: "error",
        text: "Please enter the 6-digit verification code",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "http://https://web-production-c29aa.up.railway.app/api/password/verify-otp",
        {
          email,
          otp,
        },
      );

      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setMessage({ type: "success", text: response.data.msg });
        setStep(3);
      } else {
        setMessage({ type: "error", text: response.data.msg });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Invalid OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in both fields" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "http://https://web-production-c29aa.up.railway.app/api/password/reset",
        {
          resetToken,
          password,
          confirmPassword,
        },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: response.data.msg });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage({ type: "error", text: response.data.msg });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.msg ||
          "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              {step === 1 && <FiSend className="w-8 h-8 text-white" />}
              {step === 2 && <FiLock className="w-8 h-8 text-white" />}
              {step === 3 && <FiKey className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === 1 && "Reset Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && `Enter the 6-digit code sent to ${email}`}
              {step === 3 && "Enter your new password below"}
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-600"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              {message.type === "success" ? (
                <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full pl-10 pr-4 py-3 text-center text-2xl tracking-widest bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                Code expires in:{" "}
                <span className="font-semibold text-blue-600">
                  {formatTime(timeLeft)}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-sm text-blue-600 hover:text-blue-700 transition font-medium"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition text-sm font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto transition font-medium"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
