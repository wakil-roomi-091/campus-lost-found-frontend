import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiActivity,
  FiUsers,
  FiPackage,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiRefreshCw,
  FiFilter,
  FiEye,
  FiMail,
  FiMapPin,
  FiPhone,
  FiCheckCircle,
  FiLink,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

const AdminActivityLogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    action: "",
    actionType: "",
    startDate: "",
    endDate: "",
  });
  const [showAlert, setShowAlert] = useState(false);
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
    fetchLogs();
    fetchStats();
  }, [user, navigate, page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page,
        limit: 20,
        ...(filters.action && { action: filters.action }),
        ...(filters.actionType && { actionType: filters.actionType }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await axios.get(
        `http://https://web-production-c29aa.up.railway.app/api/activity-logs?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setLogs(response.data.logs);
        setTotalPages(response.data.pages);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setAlertConfig({
        title: "Error",
        message: "Failed to load activity logs",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://https://web-production-c29aa.up.railway.app/api/activity-logs/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
    fetchStats();
  };

  const handleClearFilters = () => {
    setFilters({ action: "", actionType: "", startDate: "", endDate: "" });
    setPage(1);
  };

  const getActionIcon = (action) => {
    const icons = {
      login: <FiLogIn className="w-4 h-4 text-green-400" />,
      logout: <FiLogOut className="w-4 h-4 text-yellow-400" />,
      register: <FiUser className="w-4 h-4 text-blue-400" />,
      create_item: <FiPackage className="w-4 h-4 text-green-400" />,
      update_item: <FiEdit2 className="w-4 h-4 text-blue-400" />,
      delete_item: <FiTrash2 className="w-4 h-4 text-red-400" />,
      update_profile: <FiEdit2 className="w-4 h-4 text-purple-400" />,
      mark_resolved: <FiCheckCircle className="w-4 h-4 text-teal-400" />,
    };
    return icons[action] || <FiActivity className="w-4 h-4 text-gray-400" />;
  };

  const getActionBgColor = (action) => {
    if (action === "login" || action === "register") return "bg-green-500/20";
    if (action === "logout") return "bg-yellow-500/20";
    if (action === "create_item") return "bg-green-500/20";
    if (action === "update_item") return "bg-blue-500/20";
    if (action === "delete_item") return "bg-red-500/20";
    if (action === "update_profile") return "bg-purple-500/20";
    if (action === "mark_resolved") return "bg-teal-500/20";
    if (action.includes("admin")) return "bg-purple-500/20";
    return "bg-gray-500/20";
  };

  const actionTypes = [
    { value: "auth", label: "Authentication" },
    { value: "item", label: "Items" },
    { value: "profile", label: "Profile" },
    { value: "admin", label: "Admin" },
    { value: "category", label: "Categories" },
    { value: "export", label: "Export" },
  ];

  const actions = [
    { value: "login", label: "Login" },
    { value: "logout", label: "Logout" },
    { value: "register", label: "Register" },
    { value: "create_item", label: "Create Item" },
    { value: "update_item", label: "Update Item" },
    { value: "delete_item", label: "Delete Item" },
    { value: "mark_resolved", label: "Mark Resolved" },
    { value: "update_profile", label: "Update Profile" },
    { value: "admin_update_user", label: "Admin Update User" },
    { value: "admin_delete_user", label: "Admin Delete User" },
  ];

  const getActionLabel = (action) => {
    const found = actions.find((a) => a.value === action);
    return found ? found.label : action?.replace(/_/g, " ") || "Unknown";
  };

  const getReadableDetails = (details, action) => {
    if (!details) return null;

    switch (action) {
      case "update_profile":
        return (
          <div className="space-y-1">
            {details.updatedFields?.includes("name") && (
              <div className="flex items-center gap-2 text-sm">
                <FiUser className="text-gray-500" size={14} />
                <span className="text-gray-400">Name was updated</span>
              </div>
            )}
            {details.updatedFields?.includes("bio") && (
              <div className="flex items-center gap-2 text-sm">
                <FiEdit2 className="text-gray-500" size={14} />
                <span className="text-gray-400">Bio was updated</span>
              </div>
            )}
            {details.updatedFields?.includes("location") && (
              <div className="flex items-center gap-2 text-sm">
                <FiMapPin className="text-gray-500" size={14} />
                <span className="text-gray-400">Location was updated</span>
              </div>
            )}
            {details.updatedFields?.includes("phone") && (
              <div className="flex items-center gap-2 text-sm">
                <FiPhone className="text-gray-500" size={14} />
                <span className="text-gray-400">Phone number was updated</span>
              </div>
            )}
            {details.updatedFields?.includes("socialLinks") && (
              <div className="flex items-center gap-2 text-sm">
                <FiLink className="text-gray-500" size={14} />
                <span className="text-gray-400">Social links were updated</span>
              </div>
            )}
          </div>
        );

      case "create_item":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <FiPackage className="text-gray-500" size={14} />
              <span className="text-gray-400">
                Item: <strong className="text-white">{details.itemName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                  details.type === "lost"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {details.type === "lost" ? "Lost" : "Found"}
              </span>
            </div>
          </div>
        );

      case "update_item":
        return (
          <div className="flex items-center gap-2 text-sm">
            <FiEdit2 className="text-gray-500" size={14} />
            <span className="text-gray-400">
              Updated item:{" "}
              <strong className="text-white">{details.itemName}</strong>
            </span>
          </div>
        );

      case "delete_item":
        return (
          <div className="flex items-center gap-2 text-sm">
            <FiTrash2 className="text-gray-500" size={14} />
            <span className="text-gray-400">
              Deleted item:{" "}
              <strong className="text-white">{details.itemName}</strong>
            </span>
          </div>
        );

      case "mark_resolved":
        return (
          <div className="flex items-center gap-2 text-sm">
            <FiCheckCircle className="text-gray-500" size={14} />
            <span className="text-gray-400">
              Marked as resolved:{" "}
              <strong className="text-white">{details.itemName}</strong>
            </span>
          </div>
        );

      case "register":
        return (
          <div className="flex items-center gap-2 text-sm">
            <FiMail className="text-gray-500" size={14} />
            <span className="text-gray-400">
              Email: <strong className="text-white">{details.email}</strong>
            </span>
          </div>
        );

      case "login":
        return (
          <div className="flex items-center gap-2 text-sm">
            <FiLogIn className="text-gray-500" size={14} />
            <span className="text-gray-400">Successful login</span>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
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
                <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Activities</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalLogs}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <FiActivity className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.uniqueUsers}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Items Created</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.actionCounts?.find((a) => a._id === "create_item")
                      ?.count || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <FiPackage className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-gray-500" />
            <span className="font-medium text-gray-300">Filters</span>
            {(filters.action ||
              filters.actionType ||
              filters.startDate ||
              filters.endDate) && (
              <button
                onClick={handleClearFilters}
                className="ml-auto text-sm text-emerald-400 hover:text-emerald-300"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.actionType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  actionType: e.target.value,
                  action: "",
                })
              }
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
            >
              <option value="">All Types</option>
              {actionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              disabled={!filters.actionType}
            >
              <option value="">All Actions</option>
              {actions
                .filter(
                  (a) =>
                    !filters.actionType || a.value.includes(filters.actionType),
                )
                .map((action) => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-700/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-xl flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {log.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {log.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${getActionBgColor(log.action)}`}
                        >
                          {getActionIcon(log.action)}
                        </div>
                        <span className="text-sm text-gray-300 capitalize">
                          {getActionLabel(log.action)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-400">
                        {getReadableDetails(log.details, log.action)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiActivity className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400">No activity logs found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-700">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 text-gray-300"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 text-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

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

export default AdminActivityLogs;
