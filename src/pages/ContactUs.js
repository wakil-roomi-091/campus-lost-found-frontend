// client/src/pages/ContactUs.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { contactAPI } from "../utils/api";
import Navbar from "../components/layout/Navbar";

const ContactUs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Pre-fill form if user is logged in
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Using your existing api.js with the contactAPI we added
      const response = await contactAPI.sendMessage({
        ...formData,
        userId: user?.id || null,
      });

      setStatus({
        type: "success",
        message:
          "✅ Message sent successfully! We'll get back to you within 24-48 hours. A confirmation email has been sent to your inbox.",
      });

      // Reset form but keep name and email if user is logged in
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        type: "error",
        message:
          error.message || "❌ Failed to send message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email",
      details: "wakila971@gmail.com",
      gradient: "from-blue-500 to-cyan-500",
      link: "mailto:wakila971@gmail.com",
    },
    {
      icon: FiPhone,
      title: "Phone",
      details: "+92 329 9951220",
      gradient: "from-green-500 to-emerald-500",
      link: "tel:+923299951220",
    },
    {
      icon: FiMapPin,
      title: "Address",
      details: "University Campus, Main Building, Room 101",
      gradient: "from-purple-500 to-pink-500",
      link: null,
    },
    {
      icon: FaRegClock,
      title: "Office Hours",
      details: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
      gradient: "from-orange-500 to-red-500",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-10 bg-gray-800 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-700"
      >
        <FiArrowLeft className="text-gray-400" />
      </button>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-6">
              <FiSend className="text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                Get in Touch
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Have questions or feedback? We&apos;d love to hear from you! Our
              support team typically responds within 24 hours.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-gray-400 text-sm">{info.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold">What happens next?</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• We&apos;ll receive your message immediately</li>
                <li>• You&apos;ll get an automated confirmation email</li>
                <li>• Our team reviews your inquiry within 24-48 hours</li>
                <li>• You&apos;ll receive a personal response via email</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h2>

              {status.message && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                    status.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {status.type === "success" ? (
                    <FiCheckCircle className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <p
                    className={`text-sm ${status.type === "success" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {status.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Please describe your question or concern in detail..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
