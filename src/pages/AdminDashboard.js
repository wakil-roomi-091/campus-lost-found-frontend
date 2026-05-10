import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUsers,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiActivity,
  FiShield,
  FiArrowRight,
  FiGrid,
  FiDownload,
  FiTrendingUp,
  FiAward,
  FiUserCheck,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiMail, // Add this import
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import Navbar from "../components/layout/Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, fetchStats, loading } = useAdmin();
  const [initialLoad, setInitialLoad] = useState(true);

  const loadStats = useCallback(async () => {
    if (user?.role === "admin") {
      await fetchStats();
      setInitialLoad(false);
    }
  }, [user, fetchStats]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    loadStats();
  }, [user, navigate, loadStats]);

  // Main Stats Cards - Key Metrics
  const mainStats = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      gradient: "from-emerald-500 to-teal-500",
      link: "/admin/users",
      description: "Registered users",
    },
    {
      title: "Total Items",
      value: stats?.totalItems || 0,
      icon: FiPackage,
      gradient: "from-purple-500 to-pink-500",
      link: "/admin/items",
      description: "All reported items",
    },
    {
      title: "Lost Items",
      value: stats?.lostItems || 0,
      icon: FiAlertCircle,
      gradient: "from-red-500 to-rose-500",
      link: "/admin/items?type=lost",
      description: "Items reported lost",
    },
    {
      title: "Found Items",
      value: stats?.foundItems || 0,
      icon: FiCheckCircle,
      gradient: "from-green-500 to-emerald-500",
      link: "/admin/items?type=found",
      description: "Items reported found",
    },
    {
      title: "Active Items",
      value: stats?.activeItems || 0,
      icon: FiClock,
      gradient: "from-yellow-500 to-orange-500",
      link: "/admin/items?status=active",
      description: "Currently active",
    },
    {
      title: "Resolved Items",
      value: stats?.resolvedItems || 0,
      icon: FiCheckCircle,
      gradient: "from-teal-500 to-cyan-500",
      link: "/admin/items?status=resolved",
      description: "Successfully resolved",
    },
  ];

  // Management Sections - Organized by category
  const managementSections = [
    {
      category: "User Management",
      icon: FiUsers,
      gradient: "from-blue-500 to-cyan-500",
      items: [
        {
          title: "All Users",
          description: "View, edit, and manage all registered users",
          icon: FiUsers,
          link: "/admin/users",
          gradient: "from-blue-500 to-cyan-500",
          stats: stats?.totalUsers || 0,
        },
        {
          title: "User Activity",
          description: "Monitor user actions and behavior",
          icon: FiActivity,
          link: "/admin/activity-logs",
          gradient: "from-indigo-500 to-purple-500",
          stats: "Monitor",
        },
      ],
    },
    {
      category: "Content Management",
      icon: FiPackage,
      gradient: "from-green-500 to-emerald-500",
      items: [
        {
          title: "All Items",
          description: "Manage all lost and found items",
          icon: FiPackage,
          link: "/admin/items",
          gradient: "from-green-500 to-emerald-500",
          stats: stats?.totalItems || 0,
        },
        {
          title: "Categories",
          description: "Add, edit, or delete item categories",
          icon: FiGrid,
          link: "/admin/categories",
          gradient: "from-purple-500 to-pink-500",
          stats: "Manage",
        },
      ],
    },
    {
      category: "Contact Management",
      icon: FiMail,
      gradient: "from-emerald-500 to-teal-500",
      items: [
        {
          title: "Contact Messages",
          description: "View, reply, and manage user inquiries and complaints",
          icon: FiMail,
          link: "/admin/contact-messages",
          gradient: "from-emerald-500 to-teal-500",
          stats: "Manage",
        },
      ],
    },
    {
      category: "Analytics & Reports",
      icon: FiBarChart2,
      gradient: "from-orange-500 to-red-500",
      items: [
        {
          title: "System Health",
          description: "Monitor system performance and status",
          icon: FiActivity,
          link: "/admin/health",
          gradient: "from-orange-500 to-red-500",
          stats: "98%",
        },
        {
          title: "Reports",
          description: "View detailed reports and statistics",
          icon: FiBarChart2,
          link: "/admin/reports",
          gradient: "from-pink-500 to-rose-500",
          stats: "24",
        },
        {
          title: "Export Data",
          description: "Export data as CSV, Excel, or PDF",
          icon: FiDownload,
          link: "/admin/export",
          gradient: "from-teal-500 to-cyan-500",
          stats: "Export",
        },
      ],
    },
  ];

  // Recent Activity Data
  const recentActivities = [
    {
      id: 1,
      action: "New user registered",
      user: "John Doe",
      time: "2 minutes ago",
      type: "user",
    },
    {
      id: 2,
      action: "Item reported",
      item: "Black Wallet",
      time: "15 minutes ago",
      type: "item",
    },
    {
      id: 3,
      action: "Item resolved",
      item: "iPhone Charger",
      time: "1 hour ago",
      type: "resolved",
    },
    {
      id: 4,
      action: "User role updated",
      user: "Sarah (Admin)",
      time: "3 hours ago",
      type: "admin",
    },
    {
      id: 5,
      action: "New category added",
      category: "Sports Equipment",
      time: "5 hours ago",
      type: "category",
    },
  ];

  if (loading && initialLoad) {
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

      <div className="container mx-auto px-4 py-8">
        {/* Header - Dark Premium Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl mb-8 border border-gray-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome back,{" "}
                  <span className="font-semibold text-emerald-400">
                    {user?.name}
                  </span>
                  . Here&apos;s what&apos;s happening in your system.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
                  <FiShield className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid - Dark Theme */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {mainStats.map((stat, index) => (
            <div
              key={index}
              onClick={() => navigate(stat.link)}
              className="group bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-700"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Management Sections - Organized Grid */}
        <div className="space-y-8 mb-8">
          {managementSections.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-8 h-8 bg-gradient-to-br ${section.gradient} rounded-lg flex items-center justify-center`}
                >
                  <section.icon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {section.category}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.link}
                    className="group bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-700 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {item.title}
                          </h3>
                          <span className="text-2xl font-bold text-emerald-400">
                            {item.stats}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                          Access{" "}
                          <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section - Dark Theme */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Recent Activity
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Latest actions in the system
                </p>
              </div>
              <Link
                to="/admin/activity-logs"
                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-700">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-gray-700/50 transition flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "user"
                      ? "bg-blue-500/20 text-blue-400"
                      : activity.type === "item"
                        ? "bg-purple-500/20 text-purple-400"
                        : activity.type === "resolved"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  {activity.type === "user" && <FiUsers className="w-5 h-5" />}
                  {activity.type === "item" && (
                    <FiPackage className="w-5 h-5" />
                  )}
                  {activity.type === "resolved" && (
                    <FiCheckCircle className="w-5 h-5" />
                  )}
                  {activity.type === "admin" && (
                    <FiShield className="w-5 h-5" />
                  )}
                  {activity.type === "category" && (
                    <FiGrid className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.user && `User: ${activity.user}`}
                    {activity.item && `Item: ${activity.item}`}
                    {activity.category && `Category: ${activity.category}`}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
