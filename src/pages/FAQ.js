// client/src/pages/FAQ.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiSearch,
  FiMessageCircle,
  FiArrowRight,
  FiHelpCircle,
  FiArrowLeft,
} from "react-icons/fi";
import Navbar from "../components/layout/Navbar";

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      category: "Getting Started",
      question: "How do I report a lost item?",
      answer:
        "To report a lost item, log in to your account, click on 'Report Lost Item' from the dashboard, fill in the details including item name, description, location, and upload photos. Click submit, and your item will be listed for others to see. You'll receive notifications if someone finds a matching item.",
    },
    {
      category: "Getting Started",
      question: "How do I report a found item?",
      answer:
        "Reporting a found item is similar to reporting a lost one. Log in, click 'Report Found Item', provide the item details and location, upload photos, and submit. This helps the owner identify their belonging. You can also browse lost items to see if anyone has reported losing something you found.",
    },
    {
      category: "Getting Started",
      question: "Is the platform free to use?",
      answer:
        "Yes! Campus Lost & Found is completely free for all university students. We believe in helping the community without any financial barriers. There are no hidden fees or premium features - everything is available to all users.",
    },
    {
      category: "Communication",
      question: "How do I contact someone about an item?",
      answer:
        "Once you find an item listing, click on 'Contact Owner' button. This opens a chat interface where you can message the person directly. All communication happens in real-time within the platform. You can also negotiate pickup arrangements through the chat.",
    },
    {
      category: "Communication",
      question: "What happens when an item is returned?",
      answer:
        "After successful return, both parties can rate each other and mark the item as 'Resolved'. This helps build trust in the community and shows successful reunions. You can also leave feedback about your experience to help others.",
    },
    {
      category: "Management",
      question: "How long do items stay listed?",
      answer:
        "Items remain listed until the owner marks them as 'Resolved' or deletes them. We recommend removing listings once items are returned to avoid confusion. You can also archive old items that are no longer relevant.",
    },
    {
      category: "Management",
      question: "Can I edit my item listing?",
      answer:
        "Yes, you can edit your item listing anytime from the 'My Items' page. Click on the edit icon next to your item to update details, description, or photos. You can also change the status from active to resolved.",
    },
    {
      category: "Safety & Security",
      question: "What should I do if someone is being dishonest?",
      answer:
        "Use the 'Report User' or 'Report Message' feature in the chat. Our admin team reviews all reports and takes appropriate action, including blocking users if necessary. We take user safety very seriously.",
    },
    {
      category: "Account",
      question: "How do I reset my password?",
      answer:
        "Click on 'Forgot Password' on the login page. Enter your email address, and you'll receive an OTP. Verify the OTP and set a new password. Make sure to choose a strong password for security.",
    },
    {
      category: "Account",
      question: "Can I delete my account?",
      answer:
        "To delete your account, go to your profile settings and look for the delete account option. Note that this action is permanent and removes all your listings and data. Make sure to resolve any ongoing conversations before deleting.",
    },
  ];

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
              <FiHelpCircle className="text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                Help Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Find answers to common questions about Campus Lost & Found
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setSearchTerm(category)}
                      className="w-full text-left px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4">
                  <FiMessageCircle className="text-emerald-400 text-2xl mb-2" />
                  <h4 className="text-white font-semibold mb-1">
                    Still have questions?
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Can&apos;t find the answer? Contact our support team.
                  </p>
                  <Link
                    to="/contact"
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                  >
                    Contact Support <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
                <FiHelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-400">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700/50 transition-colors"
                    >
                      <div>
                        <span className="text-xs text-emerald-400 mb-1 block">
                          {faq.category}
                        </span>
                        <span className="text-white font-medium">
                          {faq.question}
                        </span>
                      </div>
                      <FiChevronDown
                        className={`text-gray-400 transition-transform duration-300 ${
                          openIndex === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="px-6 pb-4 pt-2 border-t border-gray-700">
                        <p className="text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
