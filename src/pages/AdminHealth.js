import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiActivity,
  FiDatabase,
  FiServer,
  FiClock,
  FiCpu,
  FiHardDrive,
  FiZap,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import axios from "axios";

const AdminHealth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    fetchHealthData();
  }, [user, navigate]);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://https://web-production-c29aa.up.railway.app/api/admin/health",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setHealthData(response.data.health);
      }
    } catch (err) {
      console.error("Error fetching health data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHealthData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-400 bg-green-500/20";
      case "warning":
        return "text-yellow-400 bg-yellow-500/20";
      case "critical":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-emerald-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiActivity className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiActivity className="w-10 h-10 text-gray-500" />
          </div>
          <p className="text-gray-400">Unable to load health data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
            >
              <FiArrowLeft /> Back
            </button>
            <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              </div>
              <div className="relative z-10 px-6 py-3">
                <h1 className="text-2xl font-bold text-white">System Health</h1>
              </div>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Server Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FiServer className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Server Status
              </h2>
              <span
                className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(healthData.server?.status)}`}
              >
                {healthData.server?.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Uptime</span>
                <span className="font-medium text-white">
                  {formatUptime(healthData.server?.uptime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Response Time</span>
                <span className="font-medium text-white">
                  {healthData.server?.responseTime}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Started</span>
                <span className="font-medium text-white">
                  {new Date(healthData.server?.startTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Database Status Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FiDatabase className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Database Status
              </h2>
              <span
                className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(healthData.database?.status)}`}
              >
                {healthData.database?.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Collections</span>
                <span className="font-medium text-white">
                  {healthData.database?.collections}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Data Size</span>
                <span className="font-medium text-white">
                  {healthData.database?.dataSize} MB
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Storage Size</span>
                <span className="font-medium text-white">
                  {healthData.database?.storageSize} MB
                </span>
              </div>
            </div>
          </div>

          {/* API Status Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FiZap className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">API Status</h2>
              <span
                className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(healthData.api?.status)}`}
              >
                {healthData.api?.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Users</span>
                <span className="font-medium text-white">
                  {healthData.api?.totalUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Items</span>
                <span className="font-medium text-white">
                  {healthData.api?.totalItems}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Endpoints</span>
                <span className="font-medium text-white">
                  {healthData.api?.endpoints}
                </span>
              </div>
            </div>
          </div>

          {/* Memory Usage Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <FiCpu className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Memory Usage</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">RSS</span>
                <span className="font-medium text-white">
                  {healthData.memory?.usage} MB
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Heap Used</span>
                <span className="font-medium text-white">
                  {healthData.memory?.heapUsed} MB
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Heap Total</span>
                <span className="font-medium text-white">
                  {healthData.memory?.heapTotal} MB
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Heap Usage</span>
                  <span className="text-sm font-medium text-white">
                    {Math.round(
                      (healthData.memory?.heapUsed /
                        healthData.memory?.heapTotal) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      healthData.memory?.heapUsed /
                        healthData.memory?.heapTotal >
                      0.8
                        ? "bg-red-500"
                        : healthData.memory?.heapUsed /
                              healthData.memory?.heapTotal >
                            0.6
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${(healthData.memory?.heapUsed / healthData.memory?.heapTotal) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHealth;
