import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiPackage, FiEdit2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import Navbar from "../components/layout/Navbar";
import AlertModal from "../components/common/AlertModal";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateItem } = useItems();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    type: "",
    location: "",
    description: "",
    date: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const categories = [
    "Electronics",
    "Wallet/Purse",
    "Keys",
    "Books",
    "Clothing",
    "Accessories",
    "ID Cards",
    "Documents",
    "Other",
  ];

  const locations = [
    "Library",
    "Computer Lab",
    "Student Center",
    "Cafeteria",
    "Sports Complex",
    "Parking Lot",
    "Classroom Building",
    "Other",
  ];

  // Load item data
  useEffect(() => {
    const loadItem = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://https://web-production-c29aa.up.railway.app/api/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (data.success && data.item) {
          const item = data.item;

          // Check ownership
          const itemUserId = item.userId?._id || item.userId;
          if (itemUserId !== user.id) {
            setAlertConfig({
              title: "Unauthorized",
              message: "You are not authorized to edit this item",
              type: "error",
            });
            setShowAlert(true);
            return;
          }

          // Format date
          const itemDate = item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : "";

          setFormData({
            itemName: item.itemName || "",
            category: item.category || "",
            type: item.type || "",
            location: item.location || "",
            description: item.description || "",
            date: itemDate,
            status: item.status || "active",
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading item:", err);
        setError("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (
      !formData.itemName ||
      !formData.category ||
      !formData.type ||
      !formData.location ||
      !formData.description ||
      !formData.date
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = await updateItem(id, formData);

      if (result.success) {
        setAlertConfig({
          title: "Success!",
          message: "Item updated successfully!",
          type: "success",
        });
        setShowAlert(true);
        // DON'T navigate here - wait for modal to close
      } else {
        setError(result.error || "Failed to update item");
        setSaving(false);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating");
      setSaving(false);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    // Navigate ONLY after modal is closed
    if (alertConfig.type === "success") {
      navigate("/my-items");
    }
  };

  if (loading) {
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

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 mb-4">Item not found</p>
            <button
              onClick={() => navigate("/my-items")}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition"
            >
              Back to My Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition mb-4"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Header - Fixed to match Dashboard style */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl mb-6 border border-gray-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiEdit2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Item</h1>
                <p className="text-gray-400 text-sm">
                  Update your item details
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6"
        >
          {/* Item Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
              disabled={saving}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              disabled={saving}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === "lost"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-red-500"
                  disabled={saving}
                />
                Lost
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === "found"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-green-500"
                  disabled={saving}
                />
                Found
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              disabled={saving}
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              disabled={saving}
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              disabled={saving}
            >
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
              disabled={saving}
              placeholder="Provide details about the item..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                saving
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-emerald-500/20"
              }`}
            >
              <FiSave />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={handleAlertClose}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default EditItem;
