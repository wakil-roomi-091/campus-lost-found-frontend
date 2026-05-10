// client/src/pages/AboutUs.js
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTarget,
  FiHeart,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiMessageCircle,
  FiSearch,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import Navbar from "../components/layout/Navbar";

const AboutUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    {
      label: "Items Reunited",
      value: "500+",
      icon: FiCheckCircle,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Active Users",
      value: "1000+",
      icon: FiUsers,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Success Rate",
      value: "95%",
      icon: FiTrendingUp,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "24/7 Support",
      value: "Always",
      icon: FiHeart,
      gradient: "from-red-500 to-rose-500",
    },
  ];

  const steps = [
    {
      icon: FiMessageCircle,
      title: "Report Item",
      description:
        "Lost something? Found something? Report it with photos, description, and location.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiSearch,
      title: "Search & Match",
      description:
        "Browse through reported items or wait for someone to find your lost belonging.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: FiUsers,
      title: "Connect & Return",
      description:
        "Chat with the finder/owner, arrange pickup, and complete the return process.",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const team = [
    {
      role: "Development Team",
      icon: FiUsers,
      description: "Building robust solutions",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      role: "Design Team",
      icon: FiHeart,
      description: "Creating user-friendly interfaces",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      role: "Support Team",
      icon: FiMessageCircle,
      description: "Helping users 24/7",
      gradient: "from-emerald-500 to-teal-500",
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

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-6">
              <FiHeart className="text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                About Us
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Helping Students Reconnect with
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {" "}
                Lost Belongings
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Since 2024, we&apos;ve been on a mission to create a trusted,
              efficient, and user-friendly platform that connects students who
              have lost items with those who have found them.
            </p>
            <Link
              to="/register"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              Join Our Community <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full mb-4">
                <FiTarget className="text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">
                  Our Mission
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Making Campus Life Better, One Return at a Time
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Every year, thousands of valuable items are lost on university
                campuses. Students lose everything from laptops and phones to
                wallets and ID cards – items that are expensive and emotionally
                important to replace.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We&apos;re here to change that statistic. Our platform creates a
                central hub where lost items can be quickly reported and found
                items can be easily returned, fostering a culture of honesty and
                community support.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-8 border border-gray-700">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Why We Exist
              </h3>
              <p className="text-gray-400">
                We believe that every lost item deserves a chance to be reunited
                with its owner. Our platform reduces waste, saves students
                money, and builds a stronger, more connected campus community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-4">
            <FiTrendingUp className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Three simple steps to reunite lost items with their owners
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mb-2">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-4">
            <FiUsers className="text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Our Team
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Behind the Platform
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Dedicated individuals working hard to make campus life better
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="group bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-20 h-20 bg-gradient-to-br ${member.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <member.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {member.role}
              </h3>
              <p className="text-gray-400 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 mb-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-12 text-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-emerald-100 mb-6 max-w-md mx-auto">
              Start helping yourself and others by reporting lost and found
              items today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                onClick={() => window.scrollTo(0, 0)}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Sign Up Now
              </Link>
              <Link
                to="/search"
                onClick={() => window.scrollTo(0, 0)}
                className="px-6 py-3 bg-emerald-500/20 text-white rounded-xl font-semibold hover:bg-emerald-500/30 transition-all duration-300 border border-white/20"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
