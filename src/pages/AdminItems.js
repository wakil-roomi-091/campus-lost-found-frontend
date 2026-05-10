import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiTrash2,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import Navbar from "../components/layout/Navbar";
import ConfirmModal from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";

const AdminItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, fetchAllItems, deleteItem, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const status = params.get("status");

    if (type) setTypeFilter(type);
    if (status) setStatusFilter(status);
  }, [location]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    loadItems();
  }, [user, navigate]);

  const loadItems = async () => {
    await fetchAllItems();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const handleDeleteClick = (itemId, itemName) => {
    setItemToDelete({ id: itemId, name: itemName });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteItem(itemToDelete.id);
    setShowDeleteConfirm(false);
    setAlertConfig({
      title: "Success",
      message: `"${itemToDelete.name}" has been deleted successfully.`,
      type: "success",
    });
    setShowAlert(true);
    setItemToDelete(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const lostCount = items.filter((item) => item.type === "lost").length;
  const foundCount = items.filter((item) => item.type === "found").length;
  const activeCount = items.filter((item) => item.status === "active").length;
  const resolvedCount = items.filter(
    (item) => item.status === "resolved",
  ).length;

  if (loading && items.length === 0) {
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
                <h1 className="text-2xl font-bold text-white">
                  Item Management
                </h1>
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

        {/* Filter Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
              navigate("/admin/items");
            }}
            className={`bg-gray-800 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition border border-gray-700 ${
              typeFilter === "all" && statusFilter === "all"
                ? "ring-2 ring-emerald-500"
                : ""
            }`}
          >
            <div className="text-xl font-bold text-white">{items.length}</div>
            <div className="text-sm text-gray-400">Total Items</div>
          </div>
          <div
            onClick={() => {
              setTypeFilter("lost");
              setStatusFilter("all");
              navigate("/admin/items?type=lost");
            }}
            className={`bg-gray-800 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition border border-gray-700 ${
              typeFilter === "lost" ? "ring-2 ring-red-500" : ""
            }`}
          >
            <div className="text-xl font-bold text-red-400">{lostCount}</div>
            <div className="text-sm text-gray-400">Lost Items</div>
          </div>
          <div
            onClick={() => {
              setTypeFilter("found");
              setStatusFilter("all");
              navigate("/admin/items?type=found");
            }}
            className={`bg-gray-800 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition border border-gray-700 ${
              typeFilter === "found" ? "ring-2 ring-green-500" : ""
            }`}
          >
            <div className="text-xl font-bold text-green-400">{foundCount}</div>
            <div className="text-sm text-gray-400">Found Items</div>
          </div>
          <div
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("active");
              navigate("/admin/items?status=active");
            }}
            className={`bg-gray-800 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition border border-gray-700 ${
              statusFilter === "active" ? "ring-2 ring-yellow-500" : ""
            }`}
          >
            <div className="text-xl font-bold text-yellow-400">
              {activeCount}
            </div>
            <div className="text-sm text-gray-400">Active Items</div>
          </div>
          <div
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("resolved");
              navigate("/admin/items?status=resolved");
            }}
            className={`bg-gray-800 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition border border-gray-700 ${
              statusFilter === "resolved" ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <div className="text-xl font-bold text-purple-400">
              {resolvedCount}
            </div>
            <div className="text-sm text-gray-400">Resolved Items</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-gray-500" />
            <span className="font-medium text-gray-300">Filters</span>
            {(typeFilter !== "all" || statusFilter !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setStatusFilter("all");
                  setSearchTerm("");
                  navigate("/admin/items");
                }}
                className="ml-auto text-sm text-emerald-400 hover:text-emerald-300"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                navigate(
                  `/admin/items?type=${e.target.value}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`,
                );
              }}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
            >
              <option value="all">All Types</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                navigate(
                  `/admin/items?status=${e.target.value}${typeFilter !== "all" ? `&type=${typeFilter}` : ""}`,
                );
              }}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No items found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition">
                      {item.itemName}
                    </h3>
                    <div className="flex gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-medium ${
                          item.type === "lost"
                            ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        }`}
                      >
                        {item.type === "lost" ? "Lost" : "Found"}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-medium ${
                          item.status === "active"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <p className="flex items-center gap-2">
                      <FiMapPin className="text-gray-500" size={14} />{" "}
                      {item.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-gray-500" size={14} />{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiUser className="text-gray-500" size={14} />{" "}
                      {item.userId?.name || "Unknown"}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/item/${item._id}`}
                      className="p-2 text-emerald-400 hover:bg-gray-700 rounded-lg transition"
                      title="View details"
                    >
                      <FiEye size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item._id, item.itemName)}
                      className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition"
                      title="Delete item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
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

export default AdminItems;
