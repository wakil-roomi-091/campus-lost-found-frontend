import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import PropTypes from "prop-types";
import axios from "axios";

const EmailVerification = ({ email, name, password, onBack }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds (1.5 minutes)

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

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://web-production-c29aa.up.railway.app/api/otp/verify",
        {
          email,
          otp,
          name,
          password,
        },
      );

      if (response.data.success) {
        setSuccess(response.data.msg);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;

    setResending(true);
    setError("");

    try {
      const response = await axios.post(
        "https://web-production-c29aa.up.railway.app/api/otp/resend",
        {
          email,
          name,
        },
      );

      if (response.data.success) {
        setSuccess("New verification code sent to your email!");
        setTimeLeft(90); // Reset to 90 seconds
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Failed to resend code. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FiMail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-600 mt-2">
          We&apos;ve sent a verification code to
          <br />
          <span className="font-semibold text-blue-600">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-sm text-green-600">{success}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
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
          {loading ? "Verifying..." : "Verify & Register"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || timeLeft > 0}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto transition font-medium"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${resending ? "animate-spin" : ""}`}
            />
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← Back to Registration
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes
EmailVerification.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default EmailVerification;
