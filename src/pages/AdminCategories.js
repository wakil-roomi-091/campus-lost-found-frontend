import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiRefreshCw,
  // FiCheck,
  FiX,
  // FiGripVertical,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import ConfirmModal from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

const AdminCategories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "FiPackage",
    color: "blue",
    isActive: true,
  });

  const colorOptions = [
    {
      value: "blue",
      label: "Blue",
      bgClass: "bg-blue-500/20",
      textClass: "text-blue-400",
      borderClass: "border-blue-500/30",
    },
    {
      value: "red",
      label: "Red",
      bgClass: "bg-red-500/20",
      textClass: "text-red-400",
      borderClass: "border-red-500/30",
    },
    {
      value: "green",
      label: "Green",
      bgClass: "bg-green-500/20",
      textClass: "text-green-400",
      borderClass: "border-green-500/30",
    },
    {
      value: "yellow",
      label: "Yellow",
      bgClass: "bg-yellow-500/20",
      textClass: "text-yellow-400",
      borderClass: "border-yellow-500/30",
    },
    {
      value: "purple",
      label: "Purple",
      bgClass: "bg-purple-500/20",
      textClass: "text-purple-400",
      borderClass: "border-purple-500/30",
    },
    {
      value: "pink",
      label: "Pink",
      bgClass: "bg-pink-500/20",
      textClass: "text-pink-400",
      borderClass: "border-pink-500/30",
    },
    {
      value: "indigo",
      label: "Indigo",
      bgClass: "bg-indigo-500/20",
      textClass: "text-indigo-400",
      borderClass: "border-indigo-500/30",
    },
    {
      value: "orange",
      label: "Orange",
      bgClass: "bg-orange-500/20",
      textClass: "text-orange-400",
      borderClass: "border-orange-500/30",
    },
    {
      value: "teal",
      label: "Teal",
      bgClass: "bg-teal-500/20",
      textClass: "text-teal-400",
      borderClass: "border-teal-500/30",
    },
    {
      value: "gray",
      label: "Gray",
      bgClass: "bg-gray-500/20",
      textClass: "text-gray-400",
      borderClass: "border-gray-500/30",
    },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    loadCategories();
  }, [user, navigate]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://web-production-c29aa.up.railway.app/api/categories/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setAlertConfig({
        title: "Error",
        message: "Failed to load categories",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      icon: "FiPackage",
      color: "blue",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "FiPackage",
      color: category.color || "blue",
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://https://web-production-c29aa.up.railway.app/api/categories/${categoryToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        await loadCategories();
        setAlertConfig({
          title: "Success",
          message: response.data.msg,
          type: "success",
        });
        setShowAlert(true);
      }
    } catch (err) {
      setAlertConfig({
        title: "Error",
        message: err.response?.data?.msg || "Failed to delete category",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setAlertConfig({
        title: "Error",
        message: "Category name is required",
        type: "error",
      });
      setShowAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let response;

      if (editingCategory) {
        response = await axios.put(
          `http://https://web-production-c29aa.up.railway.app/api/categories/${editingCategory._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        response = await axios.post(
          "http://https://web-production-c29aa.up.railway.app/api/categories",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      if (response.data.success) {
        await loadCategories();
        setIsModalOpen(false);
        setAlertConfig({
          title: "Success",
          message: response.data.msg,
          type: "success",
        });
        setShowAlert(true);
      }
    } catch (err) {
      setAlertConfig({
        title: "Error",
        message: err.response?.data?.msg || "Failed to save category",
        type: "error",
      });
      setShowAlert(true);
    }
  };

  const getColorClasses = (color) => {
    const option = colorOptions.find((c) => c.value === color);
    return option || colorOptions[0];
  };

  if (loading && categories.length === 0) {
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
                  Category Management
                </h1>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition"
            >
              <FiPlus /> Add Category
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {categories.map((category, index) => {
                  const colorClass = getColorClasses(category.color);
                  return (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-700/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 ${colorClass.bgClass} rounded-lg flex items-center justify-center`}
                          >
                            <FiPackage
                              className={`w-4 h-4 ${colorClass.textClass}`}
                            />
                          </div>
                          <span className="font-medium text-white">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {category.itemCount || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            category.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {category.order || index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(category)}
                            className="p-2 text-emerald-400 hover:bg-gray-700 rounded-lg transition"
                            title="Edit category"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition"
                            title="Delete category"
                            disabled={category.itemCount > 0}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400">No categories found</p>
              <button
                onClick={handleAddClick}
                className="mt-4 text-emerald-400 hover:text-emerald-300"
              >
                Create your first category
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-700 rounded-full transition"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="e.g., Electronics, Books, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="2"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Color
                </label>
                <select
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 bg-gray-900 border-gray-700"
                  />
                  <span className="text-sm text-gray-300">
                    Active (visible to users)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition"
                >
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
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

export default AdminCategories;
