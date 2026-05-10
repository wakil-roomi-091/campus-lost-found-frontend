import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiBarChart2,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiRefreshCw,
  FiFlag,
  FiUser,
  FiMessageSquare,
  FiEye,
  FiXCircle,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import AlertModal from "../components/common/AlertModal";
import ConfirmModal from "../components/common/ConfirmModal";
import axios from "axios";

const AdminReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("week");
  const [reports, setReports] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    fetchReports();
  }, [user, navigate, dateRange]);

  // Fetch Analytics Reports only (no user reports)
  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://https://web-production-c29aa.up.railway.app/api/admin/reports?range=${dateRange}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setAlertConfig({
        title: "Error",
        message: "Failed to fetch reports data",
        type: "error",
      });
      setShowAlertModal(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="text-center py-16">
          <p className="text-gray-400">Unable to load reports data</p>
        </div>
      </div>
    );
  }

  const { userStats, itemStats, activityStats, charts, recentActivity } =
    reports;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
            >
              <FiArrowLeft /> Back
            </button>
            <h1 className="text-2xl font-bold text-white">
              Analytics Dashboard
            </h1>
          </div>

          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 flex items-center gap-2 transition"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="w-8 h-8 text-blue-100" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {Math.round((userStats.new / userStats.total) * 100)}% new
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{userStats.total}</p>
            <p className="text-blue-100">Total Users</p>
            <div className="mt-4 text-sm text-blue-100">
              <span className="mr-4">📈 {userStats.new} new</span>
              <span>👥 {userStats.active} active</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiPackage className="w-8 h-8 text-purple-100" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {Math.round((itemStats.resolved / itemStats.total) * 100)}%
                resolved
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{itemStats.total}</p>
            <p className="text-purple-100">Total Items</p>
            <div className="mt-4 text-sm text-purple-100">
              <span className="mr-4">❌ {itemStats.lost} lost</span>
              <span>✅ {itemStats.found} found</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-8 h-8 text-green-100" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {dateRange}
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{activityStats.daily}</p>
            <p className="text-green-100">Items in Period</p>
            <div className="mt-4 text-sm text-green-100">
              <span className="mr-4">📊 {activityStats.weekly} weekly</span>
              <span>📅 {activityStats.monthly} monthly</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Daily Activity
            </h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {charts?.dailyActivity?.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-emerald-500 rounded-t-lg hover:bg-emerald-600 transition relative group"
                    style={{
                      height: `${Math.max(20, (day.count / Math.max(...charts.dailyActivity.map((d) => d.count))) * 150)}px`,
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      {day.count} items
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Item Distribution
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Lost Items</span>
                  <span className="font-medium text-white">
                    {itemStats.lost}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${(itemStats.lost / itemStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Found Items</span>
                  <span className="font-medium text-white">
                    {itemStats.found}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(itemStats.found / itemStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Resolved Items</span>
                  <span className="font-medium text-white">
                    {itemStats.resolved}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(itemStats.resolved / itemStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Active Items</span>
                  <span className="font-medium text-white">
                    {itemStats.active}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${(itemStats.active / itemStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentActivity?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.event}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.user}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(item.time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default AdminReports;
