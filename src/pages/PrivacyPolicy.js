// client/src/pages/PrivacyPolicy.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiLock,
  FiDatabase,
  FiEye,
  FiMail,
  FiGlobe,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";
import Navbar from "../components/layout/Navbar";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: FiDatabase,
      title: "Information We Collect",
      gradient: "from-blue-500 to-cyan-500",
      content: [
        "Name, email address, and phone number",
        "Profile information (bio, location, social links)",
        "Item descriptions and photos",
        "Chat messages and communications",
        "Ratings and reviews",
        "Usage data and device information",
      ],
    },
    {
      icon: FiEye,
      title: "How We Use Your Information",
      gradient: "from-purple-500 to-pink-500",
      content: [
        "Provide, maintain, and improve our services",
        "Connect users who have lost and found items",
        "Facilitate communication between users",
        "Send you technical notices and support messages",
        "Respond to your comments and questions",
        "Monitor and analyze trends and usage",
      ],
    },
    {
      icon: FiGlobe,
      title: "Information Sharing",
      gradient: "from-green-500 to-emerald-500",
      content: [
        "With your consent or at your direction",
        "To comply with legal obligations",
        "To protect rights, property, or safety of users",
        "With service providers who assist in our operations",
        "In connection with a business transfer or merger",
      ],
    },
    {
      icon: FiLock,
      title: "Data Security",
      gradient: "from-red-500 to-rose-500",
      content: [
        "Industry-standard encryption for data transmission",
        "Secure storage with access controls",
        "Regular security audits and updates",
        "Two-factor authentication options",
        "Automatic logout after inactivity",
        "No internet transmission is 100% secure",
      ],
    },
    {
      icon: FiShield,
      title: "Your Rights",
      gradient: "from-orange-500 to-red-500",
      content: [
        "Access and receive a copy of your data",
        "Correct inaccurate information",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Export your data in common format",
        "Withdraw consent at any time",
      ],
    },
    {
      icon: FiClock,
      title: "Data Retention",
      gradient: "from-teal-500 to-cyan-500",
      content: [
        "Active accounts: Data retained while account exists",
        "Deleted accounts: Data removed within 30 days",
        "Messages: Retained for 1 year after account deletion",
        "Logs: Retained for 90 days for security",
        "Backups: Automatically deleted after 30 days",
        "You can request immediate deletion",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Back Button - Same style as UserProfile */}
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
              <FiShield className="text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                Privacy Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Privacy Matters
            </h1>
            <p className="text-lg text-gray-400 mb-4">
              Last updated: January 1, 2024
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              At Campus Lost & Found, we take your privacy seriously. This
              policy explains how we collect, use, and protect your personal
              information.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">
              Introduction
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Welcome to Campus Lost & Found. We are committed to protecting
              your personal information and your right to privacy. If you have
              any questions or concerns about this privacy policy or our
              practices, please contact us at privacy@campuslostfound.com.
            </p>
          </div>

          {/* Sections Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="group bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.content.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-gray-400 text-sm flex items-start gap-2"
                    >
                      <span className="text-emerald-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Cookies Section */}
          <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">
              Cookies & Tracking
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity
              on our platform and hold certain information. Cookies are files
              with a small amount of data which may include an anonymous unique
              identifier.
            </p>
            <p className="text-gray-400 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent. However, if you do not accept
              cookies, you may not be able to use some portions of our platform.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">
              Children&apos;s Privacy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Our service is intended for university students who are at least
              18 years old. We do not knowingly collect personally identifiable
              information from anyone under the age of 18. If you are a parent
              or guardian and you are aware that your child has provided us with
              personal information, please contact us.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">
              Changes to This Policy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </div>

          {/* Contact Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-center">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            </div>
            <div className="relative z-10">
              <FiMail className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Questions About Privacy?
              </h3>
              <p className="text-emerald-100 mb-6">
                If you have questions about this privacy policy, please contact
                us:
              </p>
              <p className="text-white font-medium">wakila971@gmail.com</p>
              <p className="text-emerald-100 mt-2">
                University Campus, Main Building
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
