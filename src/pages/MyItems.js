import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
  FiUser,
  FiPackage,
} from "react-icons/fi";
import { FaRegFrown, FaRegSmile } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import Navbar from "../components/layout/Navbar";
import ConfirmModal from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";

const MyItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userItems, fetchUserItems, deleteItem, loading } = useItems();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      loadItems();
    }
  }, [user, navigate]);

  const loadItems = async () => {
    const result = await fetchUserItems();
    if (result.success) {
      setItems(result.data.items || []);
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
      setItems(items.filter((item) => item._id !== itemToDelete));
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

  const handleEdit = (id) => {
    navigate(`/edit-item/${id}`);
  };

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition"
              aria-label="Back to Dashboard"
            >
              <FiArrowLeft aria-hidden="true" /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-white">My Reported Items</h1>
          </div>
          <Link
            to="/search"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition"
            aria-label="Browse all items"
          >
            Browse All Items
          </Link>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              filter === "all"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            aria-label="Show all items"
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setFilter("lost")}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              filter === "lost"
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            aria-label="Show lost items only"
          >
            Lost ({items.filter((i) => i.type === "lost").length})
          </button>
          <button
            onClick={() => setFilter("found")}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              filter === "found"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            aria-label="Show found items only"
          >
            Found ({items.filter((i) => i.type === "found").length})
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiPackage
                className="w-10 h-10 text-gray-500"
                aria-hidden="true"
              />
            </div>
            <p className="text-gray-400 mb-4">
              {filter === "all"
                ? "You haven't reported any items yet"
                : `You haven't reported any ${filter} items yet`}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/report-lost"
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition"
              >
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition"
              >
                Report Found
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="h-48 bg-gray-700 relative overflow-hidden">
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
                        className="w-12 h-12 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-lg font-medium shadow-lg ${
                      item.type === "lost"
                        ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    }`}
                  >
                    {item.type === "lost" ? "Lost" : "Found"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-white mb-1 truncate">
                    {item.itemName}
                  </h3>

                  <div className="space-y-1 text-sm text-gray-400 mb-2">
                    <p className="flex items-center gap-1">
                      <FiMapPin
                        className="text-gray-500"
                        size={14}
                        aria-hidden="true"
                      />{" "}
                      {item.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <FiCalendar
                        className="text-gray-500"
                        size={14}
                        aria-hidden="true"
                      />{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                    <FiUser
                      className="text-gray-500"
                      size={14}
                      aria-hidden="true"
                    />
                    <span>Posted by: </span>
                    <Link
                      to={`/profile/${user?.id}`}
                      className="text-emerald-400 hover:text-emerald-300 hover:underline transition"
                    >
                      You
                    </Link>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      to={`/item/${item._id}`}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm py-2 rounded-xl hover:shadow-lg transition text-center"
                      aria-label={`View ${item.itemName} details`}
                    >
                      <FiEye
                        className="inline mr-1"
                        size={14}
                        aria-hidden="true"
                      />{" "}
                      View
                    </Link>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="flex-1 bg-gray-700 text-emerald-400 text-sm py-2 rounded-xl hover:bg-gray-600 transition flex items-center justify-center gap-1"
                      aria-label={`Edit ${item.itemName}`}
                    >
                      <FiEdit2 size={14} aria-hidden="true" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="flex-1 bg-gray-700 text-red-400 text-sm py-2 rounded-xl hover:bg-gray-600 transition flex items-center justify-center gap-1"
                      aria-label={`Delete ${item.itemName}`}
                    >
                      <FiTrash2 size={14} aria-hidden="true" /> Delete
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

export default MyItems;
