// client/src/components/layout/Footer.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Footer = () => {
  const location = useLocation();

  // Don't show footer on:
  // - Admin pages
  // - Auth pages (login, register, forgot-password, reset-password)
  // - Homepage (because Homepage has its own footer)
  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.includes("/reset-password") ||
    location.pathname === "/"; // Hide on Homepage

  if (hideFooter) return null;

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Campus Lost & Found
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Helping university students reunite with their lost belongings
              through community support and smart technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail className="text-emerald-400" />
                <span>wakila971@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone className="text-emerald-400" />
                <span>+92 329 9951220</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMapPin className="text-emerald-400" />
                <span>University Campus, Room 101</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-3">
             
              <a
                href="https://www.facebook.com/wakil.roomi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 group"
              >
                <FiFacebook className="text-gray-400 group-hover:text-white" />
              </a>
              <a
                href="https://www.instagram.com/roomi_091/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 group"
              >
                <FiInstagram className="text-gray-400 group-hover:text-white" />
              </a>
              <a
                href="https://www.linkedin.com/in/wakil-roomi-5b576b39b/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 group"
              >
                <FiLinkedin className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
