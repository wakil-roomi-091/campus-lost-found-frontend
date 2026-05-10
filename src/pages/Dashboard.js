import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMessageSquare,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiAward,
  FiGrid,
  FiPlusCircle,
  FiActivity,
} from "react-icons/fi";
import { FaRegFrown, FaRegSmile } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import Navbar from "../components/layout/Navbar";
import ConfirmModal from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userItems, fetchUserItems, deleteItem, loading } = useItems();
  const [allItems, setAllItems] = useState([]);
  const [allItemsLoading, setAllItemsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    active: 0,
    resolved: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      loadUserItems();
      loadAllItems();
    }
  }, [user, navigate]);

  const loadUserItems = async () => {
    const result = await fetchUserItems();
    if (result.success) {
      const items = result.data.items || [];
      setStats({
        total: items.length,
        lost: items.filter((item) => item.type === "lost").length,
        found: items.filter((item) => item.type === "found").length,
        active: items.filter((item) => item.status === "active").length,
        resolved: items.filter((item) => item.status === "resolved").length,
      });
    }
  };

  const loadAllItems = async () => {
    setAllItemsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://https://web-production-c29aa.up.railway.app/api/items",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        const otherItems = response.data.items.filter(
          (item) => item.userId?._id !== user?.id && item.userId !== user?.id,
        );
        setAllItems(otherItems.slice(0, 6));
      }
    } catch (err) {
      console.error("Error loading all items:", err);
    } finally {
      setAllItemsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const result = await deleteItem(itemToDelete);
    setShowDeleteConfirm(false);
    if (result.success) {
      loadUserItems();
      loadAllItems();
      setAlertConfig({
        title: "Success",
        message: "Item deleted successfully!",
        type: "success",
      });
      setShowAlert(true);
    } else {
      setAlertConfig({
        title: "Error",
        message: result.error || "Failed to delete item",
        type: "error",
      });
      setShowAlert(true);
    }
    setItemToDelete(null);
  };

  const statCards = [
    {
      label: "Total Items",
      value: stats.total,
      icon: FiPackage,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Lost Items",
      value: stats.lost,
      icon: FaRegFrown,
      gradient: "from-red-500 to-rose-500",
    },
    {
      label: "Found Items",
      value: stats.found,
      icon: FaRegSmile,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Active",
      value: stats.active,
      icon: FiClock,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: FiCheckCircle,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Success Rate",
      value: stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0,
      icon: FiTrendingUp,
      gradient: "from-blue-500 to-cyan-500",
      suffix: "%",
    },
  ];

  const MyItemsSection = () => {
    const myItems = userItems.slice(0, 4);

    if (myItems.length === 0) {
      return (
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center border border-gray-700">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            No Items Yet
          </h3>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            You haven&apos;t posted any items yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/report-lost"
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm md:text-base text-center"
            >
              Report Lost
            </Link>
            <Link
              to="/report-found"
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm md:text-base text-center"
            >
              Report Found
            </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {myItems.map((item) => (
            <div
              key={item._id}
              className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-40 md:h-48 bg-gray-700 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={`${item.itemName} - ${item.type === "lost" ? "Lost item" : "Found item"}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/favicon.png";
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPackage
                      className="w-10 h-10 md:w-12 md:h-12 text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 md:top-3 md:right-3 text-xs px-2 py-1 rounded-lg font-medium shadow-lg ${
                    item.type === "lost"
                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  }`}
                >
                  {item.type === "lost" ? "Lost" : "Found"}
                </span>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-semibold text-white mb-1 truncate text-sm md:text-base">
                  {item.itemName}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 flex items-center gap-1 mb-2">
                  <FiMapPin className="text-gray-500" size={12} />{" "}
                  {item.location}
                </p>
                <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      item.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                  <div className="flex gap-1">
                    <Link
                      to={`/item/${item._id}`}
                      className="p-1.5 text-blue-400 hover:bg-gray-700 rounded-lg transition"
                    >
                      <FiEye size={14} />
                    </Link>
                    <Link
                      to={`/edit-item/${item._id}`}
                      className="p-1.5 text-green-400 hover:bg-gray-700 rounded-lg transition"
                    >
                      <FiEdit2 size={14} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="p-1.5 text-red-400 hover:bg-gray-700 rounded-lg transition"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userItems.length > 4 && (
          <div className="text-center mt-4 md:mt-6">
            <Link
              to="/my-items"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium text-sm md:text-base"
            >
              View All My Items ({userItems.length}) <FiArrowRight size={14} />
            </Link>
          </div>
        )}
      </>
    );
  };

  const CommunityItemsSection = () => {
    if (allItemsLoading) {
      return (
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center border border-gray-700">
          <div className="spinner w-8 h-8 mx-auto"></div>
        </div>
      );
    }

    if (allItems.length === 0) {
      return (
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center border border-gray-700">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            No Community Items Yet
          </h3>
          <p className="text-gray-400 text-sm md:text-base">
            Be the first to report an item!
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allItems.map((item) => (
            <div
              key={item._id}
              className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-40 md:h-48 bg-gray-700 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={`${item.itemName} - ${item.type === "lost" ? "Lost item" : "Found item"}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/favicon.png";
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPackage
                      className="w-10 h-10 md:w-12 md:h-12 text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 md:top-3 md:right-3 text-xs px-2 py-1 rounded-lg font-medium shadow-lg ${
                    item.type === "lost"
                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  }`}
                >
                  {item.type === "lost" ? "Lost" : "Found"}
                </span>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-semibold text-white mb-1 truncate text-sm md:text-base">
                  {item.itemName}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 flex items-center gap-1 mb-1">
                  <FiMapPin className="text-gray-500" size={12} />{" "}
                  {item.location}
                </p>
                <p className="text-xs md:text-sm text-gray-400 flex items-center gap-1 mb-2">
                  <FiUser className="text-gray-500" size={12} /> Posted by:{" "}
                  {item.userId?.name || "Anonymous"}
                </p>
                <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mb-3">
                  {item.description}
                </p>
                <Link
                  to={`/item/${item._id}`}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs md:text-sm py-2 md:py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Only ONE "Browse All Items" button - at the bottom */}
        <div className="text-center mt-6 md:mt-8">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm md:text-base"
          >
            Browse All Items <FiArrowRight size={16} />
          </Link>
        </div>
      </>
    );
  };

  if (loading && userItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="spinner w-12 h-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl mb-6 md:mb-8 border border-gray-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-72 md:h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">
                  Here&apos;s what&apos;s happening with your items.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <FiPackage className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="group bg-gray-800 rounded-xl p-2 sm:p-3 md:p-4 hover:shadow-lg transition-all duration-300 border border-gray-700"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <card.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="text-base sm:text-lg md:text-2xl font-bold text-white">
                {card.value}
                {card.suffix || ""}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
          <Link
            to="/report-lost"
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-700 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 text-white hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <FaRegFrown className="text-2xl sm:text-3xl mb-1 sm:mb-2" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-0.5 sm:mb-1">
                  Report Lost Item
                </h3>
                <p className="text-xs sm:text-sm text-red-200">
                  Help others help you find your belongings
                </p>
              </div>
              <FiArrowRight className="text-xl sm:text-2xl group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>

          <Link
            to="/report-found"
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 text-white hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <FaRegSmile className="text-2xl sm:text-3xl mb-1 sm:mb-2" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-0.5 sm:mb-1">
                  Report Found Item
                </h3>
                <p className="text-xs sm:text-sm text-green-200">
                  Help reunite someone with their item
                </p>
              </div>
              <FiArrowRight className="text-xl sm:text-2xl group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>
        </div>

        {/* My Items Section */}
        <div className="mb-8 md:mb-10">
          <div className="flex justify-between items-center mb-4 md:mb-5">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                My Items
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Manage your reported items
              </p>
            </div>
            {userItems.length > 0 && (
              <Link
                to="/my-items"
                className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-medium"
              >
                View All →
              </Link>
            )}
          </div>
          <MyItemsSection />
        </div>

        {/* Community Items Section - REMOVED top "Browse All Items" link */}
        <div>
          <div className="mb-4 md:mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              Recent Items from Community
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Latest items posted by other users
            </p>
          </div>
          <CommunityItemsSection />
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default Dashboard;
