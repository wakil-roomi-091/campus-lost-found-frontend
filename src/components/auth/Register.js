import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiSend,
  FiUserPlus,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../layout/Navbar";
import EmailVerification from "./EmailVerification";
import axios from "axios";

const Register = () => {
  const { loading } = useAuth();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");

  const { name, email, password, confirmPassword } = formData;

  // Clear form fields on component mount to prevent autofill
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setEmailValid(null);
    setEmailMessage("");
  }, []);

  const validateEmailFormat = (emailValue) => {
    if (!emailValue) {
      setEmailValid(null);
      setEmailMessage("");
      return;
    }

    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(emailValue)) {
      setEmailValid(false);
      setEmailMessage("Please enter a valid email address");
      return;
    }

    const domain = emailValue.split("@")[1]?.toLowerCase();
    const disposableDomains = [
      "tempmail.com",
      "10minutemail.com",
      "mailinator.com",
      "yopmail.com",
      "guerrillamail.com",
      "throwaway.email",
    ];

    if (disposableDomains.includes(domain)) {
      setEmailValid(false);
      setEmailMessage("Please use a real email address (no temporary emails)");
      return;
    }

    setEmailValid(true);
    setEmailMessage("Valid email address");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError("");

    if (name === "email") {
      validateEmailFormat(value);
    }
  };

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields");
      return false;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }
    if (!emailValid) {
      setFormError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSendingOtp(true);
    setFormError("");

    try {
      const response = await axios.post(
        "https://web-production-c29aa.up.railway.app/api/otp/send",
        {
          email,
          name,
        },
      );

      if (response.data.success) {
        setStep(2);
      } else {
        setFormError(response.data.msg);
      }
    } catch (err) {
      setFormError(
        err.response?.data?.msg || "Failed to send verification code",
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <EmailVerification
              email={email}
              name={name}
              password={password}
              onBack={handleBack}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiUserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Or{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  sign in to existing account
                </Link>
              </p>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            <form
              onSubmit={handleSendOTP}
              className="space-y-5"
              autoComplete="off"
            >
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={onChange}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    autoComplete="off"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                      emailValid === true
                        ? "border-green-500"
                        : emailValid === false
                          ? "border-red-500"
                          : "border-gray-200"
                    }`}
                    placeholder="Email address"
                    required
                  />
                  {emailValid === true && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {emailMessage && (
                  <p
                    className={`mt-1 text-xs ${emailValid ? "text-green-600" : "text-red-500"}`}
                  >
                    {emailMessage}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChange}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Password (min. 6 characters)"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={onChange}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {sendingOtp ? (
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
                    Sending Code...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
