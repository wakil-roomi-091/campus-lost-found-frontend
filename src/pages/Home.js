import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShield,
  FiUsers,
  FiPackage,
  FiArrowRight,
  FiLogIn,
  FiUserPlus,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiMail,
  FiPhone,
  FiTwitter,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";

const Home = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If user is logged in, redirect to dashboard
  if (user) {
    window.location.href = "/dashboard";
    return null;
  }

  const features = [
    {
      icon: FiSearch,
      title: "Smart Search",
      description:
        "Advanced search with filters to find lost items quickly on campus.",
      color: "from-blue-500 to-cyan-500",
      delay: "0s",
    },
    {
      icon: FiPackage,
      title: "Report Items",
      description:
        "Easily report lost or found items with detailed descriptions and images.",
      color: "from-emerald-500 to-teal-500",
      delay: "0.1s",
    },
    {
      icon: FiUsers,
      title: "Community Driven",
      description:
        "Connect with fellow students to help reunite lost belongings.",
      color: "from-purple-500 to-pink-500",
      delay: "0.2s",
    },
    {
      icon: FiShield,
      title: "Secure & Verified",
      description:
        "All users are verified through email for safety and security.",
      color: "from-orange-500 to-red-500",
      delay: "0.3s",
    },
  ];

  const stats = [
    { value: "500+", label: "Active Users", icon: FiUsers, color: "blue" },
    {
      value: "200+",
      label: "Items Found",
      icon: FiCheckCircle,
      color: "green",
    },
    { value: "150+", label: "Items Reunited", icon: FiStar, color: "yellow" },
    {
      value: "95%",
      label: "Success Rate",
      icon: FiTrendingUp,
      color: "purple",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "Computer Science Student",
      content:
        "Lost my wallet in the library. Within 2 hours, someone found it through this platform! Amazing community.",
      rating: 5,
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Ahmed&background=3b82f6&color=fff",
    },
    {
      name: "Ali Raza",
      role: "Business Student",
      content:
        "Found a calculator and posted it here. The owner contacted me within an hour. Great initiative!",
      rating: 5,
      avatar:
        "https://ui-avatars.com/api/?name=Ali+Raza&background=8b5cf6&color=fff",
    },
    {
      name: "Fatima Khan",
      role: "Engineering Student",
      content:
        "This platform saved me from buying new books. Found my lost textbook through this community.",
      rating: 5,
      avatar:
        "https://ui-avatars.com/api/?name=Fatima+Khan&background=10b981&color=fff",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Modern Gradient with Animation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-white/90">
                ✨ Helping Students Since 2024
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Lost Something?{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Found Something?
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Your campus community is here to help. Join thousands of students
              reuniting with their belongings.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started{" "}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 32L48 42.7C96 53 192 75 288 80C384 85 480 75 576 64C672 53 768 43 864 48C960 53 1056 75 1152 80C1248 85 1344 75 1392 69.3L1440 64V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V32Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and effective way to report and find lost items on
              campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                ></div>
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and help your campus community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="hidden md:block absolute top-12 left-2/3 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Report Item
              </h3>
              <p className="text-gray-600">
                Post details about your lost or found item with photos and
                location
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="hidden md:block absolute top-12 left-2/3 w-full h-0.5 bg-gradient-to-r from-purple-200 to-pink-200"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search & Match
              </h3>
              <p className="text-gray-600">
                Browse through items or search for specific ones using filters
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect
              </h3>
              <p className="text-gray-600">
                Contact the person who posted the item to arrange pickup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join hundreds of satisfied students who found their belongings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the campus community today and help make our campus a better
            place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Create Free Account <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CampusLost&Found
              </h3>
              <p className="text-gray-400 text-sm">
                Helping students reunite with their belongings since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="hover:text-white transition">
                    Search Items
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <FiTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <FiGithub className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <FiLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 Campus Lost & Found. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
