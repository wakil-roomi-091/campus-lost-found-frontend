import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLogIn,
  FiSearch,
  FiShield,
  FiUser,
  FiGrid,
  FiMessageCircle,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation links for logged-in users
  const userLinks = [
    { to: "/search", icon: FiSearch, label: "Search" },
    { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
    {
      to: "/messages",
      icon: FiMessageCircle,
      label: "Messages",
      hasBadge: true,
    },
  ];

  // Admin only link
  const adminLink = { to: "/admin", icon: FiShield, label: "Admin" };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent hover:from-emerald-300 hover:to-teal-300 transition-all duration-300"
            onClick={closeMobileMenu}
            aria-label="Campus Lost & Found Home"
          >
            CampusLost&Found
          </Link>

          {/* Desktop Navigation - visible on md and above */}
          <div className="hidden md:flex items-center space-x-1">
            {!user && (
              <Link
                to="/"
                className="px-4 py-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
                aria-label="Home"
              >
                <FiHome className="inline mr-2" size={18} aria-hidden="true" />{" "}
                Home
              </Link>
            )}

            {user && (
              <>
                <Link
                  to="/search"
                  className="px-4 py-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
                  aria-label="Search items"
                >
                  <FiSearch
                    className="inline mr-2"
                    size={18}
                    aria-hidden="true"
                  />{" "}
                  Search
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
                  aria-label="Dashboard"
                >
                  <FiGrid
                    className="inline mr-2"
                    size={18}
                    aria-hidden="true"
                  />{" "}
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="px-4 py-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 relative"
                  aria-label={`Messages ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
                >
                  <FiMessageCircle
                    className="inline mr-2"
                    size={18}
                    aria-hidden="true"
                  />{" "}
                  Messages
                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                      aria-label={`${unreadCount} unread messages`}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
                    aria-label="Admin panel"
                  >
                    <FiShield
                      className="inline mr-2"
                      size={18}
                      aria-hidden="true"
                    />{" "}
                    Admin
                  </Link>
                )}
              </>
            )}

            {user ? (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-700">
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-800 transition-all duration-200"
                  aria-label={`Profile: ${user.name}`}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={`${user.name}'s profile`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <FiUser
                        className="w-4 h-4 text-gray-300"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-300 hover:text-white hidden sm:inline">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
                  aria-label="Logout"
                  title="Logout"
                >
                  <FiLogOut size={18} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-700">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
                  aria-label="Login to your account"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 hover:scale-105"
                  aria-label="Create new account"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && unreadCount > 0 && (
              <Link
                to="/messages"
                className="relative"
                aria-label={`${unreadCount} unread messages`}
              >
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <FiX size={24} aria-hidden="true" />
              ) : (
                <FiMenu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 bg-gray-900/95 backdrop-blur-md">
            <div className="flex flex-col space-y-2">
              {!user && (
                <Link
                  to="/"
                  className="px-4 py-3 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3"
                  onClick={closeMobileMenu}
                  aria-label="Home"
                >
                  <FiHome size={20} aria-hidden="true" /> Home
                </Link>
              )}

              {user && (
                <>
                  <Link
                    to="/search"
                    className="px-4 py-3 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3"
                    onClick={closeMobileMenu}
                    aria-label="Search items"
                  >
                    <FiSearch size={20} aria-hidden="true" /> Search
                  </Link>
                  <Link
                    to="/dashboard"
                    className="px-4 py-3 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3"
                    onClick={closeMobileMenu}
                    aria-label="Dashboard"
                  >
                    <FiGrid size={20} aria-hidden="true" /> Dashboard
                  </Link>
                  <Link
                    to="/messages"
                    className="px-4 py-3 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3 relative"
                    onClick={closeMobileMenu}
                    aria-label={`Messages ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
                  >
                    <FiMessageCircle size={20} aria-hidden="true" /> Messages
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full px-2 py-0.5">
                        {unreadCount} new
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-4 py-3 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3"
                      onClick={closeMobileMenu}
                      aria-label="Admin panel"
                    >
                      <FiShield size={20} aria-hidden="true" /> Admin
                    </Link>
                  )}
                </>
              )}

              {user ? (
                <>
                  <Link
                    to={`/profile/${user.id}`}
                    className="px-4 py-3 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3"
                    onClick={closeMobileMenu}
                    aria-label={`Profile: ${user.name}`}
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={`${user.name}'s profile`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser size={20} aria-hidden="true" />
                    )}
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3 w-full text-left"
                    aria-label="Logout"
                  >
                    <FiLogOut size={20} aria-hidden="true" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link
                    to="/login"
                    className="px-4 py-3 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition-all duration-200 text-center"
                    onClick={closeMobileMenu}
                    aria-label="Login to your account"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-center hover:shadow-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                    aria-label="Create new account"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
