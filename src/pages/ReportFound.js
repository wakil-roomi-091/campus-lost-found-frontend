import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiMapPin,
  FiCalendar,
  FiType,
  FiFileText,
  FiX,
  FiInfo,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import Navbar from "../components/layout/Navbar";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

// Your Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dspcl9tug";
const CLOUDINARY_UPLOAD_PRESET = "campus_lost_found";

// Create a CLEAN axios instance for Cloudinary (NO interceptors)
const cloudinaryAxios = axios.create();

// Fallback categories if API fails or no categories exist
const FALLBACK_CATEGORIES = [
  { name: "Electronics", color: "blue" },
  { name: "Wallet/Purse", color: "red" },
  { name: "Keys", color: "yellow" },
  { name: "Books", color: "green" },
  { name: "Clothing", color: "purple" },
  { name: "Accessories", color: "pink" },
  { name: "ID Cards", color: "indigo" },
  { name: "Documents", color: "orange" },
  { name: "Jewelry", color: "teal" },
  { name: "Other", color: "gray" },
];

const ReportFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createItem, loading } = useItems();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    dateFound: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch categories from API with fallback
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://web-production-c29aa.up.railway.app/api/categories",
        );
        if (response.data.success && response.data.categories.length > 0) {
          setCategories(response.data.categories);
        } else {
          console.log("No categories from API, using fallback categories");
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const locations = [
    "Library",
    "Computer Lab",
    "Student Center",
    "Cafeteria",
    "Sports Complex",
    "Parking Lot",
    "Classroom Building",
    "Administration Building",
    "Dormitory",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setAlertConfig({
        title: "Error",
        message: "You can only upload up to 5 images",
        type: "error",
      });
      setShowAlert(true);
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      setAlertConfig({
        title: "Error",
        message: "Please select only image files",
        type: "error",
      });
      setShowAlert(true);
      return;
    }

    setImages([...images, ...imageFiles]);
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviews(newPreviews);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      console.log(`📤 Uploading ${file.name} to Cloudinary...`);

      // USING THE CLEAN AXIOS INSTANCE WITHOUT INTERCEPTORS
      const response = await cloudinaryAxios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // IMPORTANT: Don't send any other headers
          withCredentials: false,
        },
      );

      console.log(`✅ Upload successful:`, response.data.secure_url);
      return response.data.secure_url;
    } catch (err) {
      console.error("❌ Cloudinary upload error:", err);
      console.error("Error details:", err.response?.data || err.message);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.itemName ||
      !formData.category ||
      !formData.location ||
      !formData.dateFound ||
      !formData.description
    ) {
      setAlertConfig({
        title: "Error",
        message: "Please fill in all required fields",
        type: "error",
      });
      setShowAlert(true);
      return;
    }

    setUploading(true);

    try {
      const imageUrls = [];
      for (const image of images) {
        const url = await uploadToCloudinary(image);
        imageUrls.push(url);
      }

      console.log("All image URLs:", imageUrls);

      const itemData = {
        itemName: formData.itemName,
        category: formData.category,
        location: formData.location,
        date: formData.dateFound,
        description: formData.description,
        type: "found",
        images: imageUrls,
      };

      console.log("Sending item data:", itemData);

      const result = await createItem(itemData);

      if (result.success) {
        setAlertConfig({
          title: "Success!",
          message: "Item reported successfully! Redirecting to dashboard...",
          type: "success",
        });
        setShowAlert(true);

        previews.forEach((url) => URL.revokeObjectURL(url));
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setAlertConfig({
          title: "Error",
          message: result.error || "Failed to report item",
          type: "error",
        });
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Upload process error:", err);
      setAlertConfig({
        title: "Error",
        message: err.message || "Failed to upload images. Please try again.",
        type: "error",
      });
      setShowAlert(true);
    } finally {
      setUploading(false);
    }
  };

  if (loadingCategories) {
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
      <div className="container mx-auto px-4 max-w-3xl py-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl mb-6 border border-gray-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 p-6">
            <h1 className="text-2xl font-bold text-white">Report Found Item</h1>
            <p className="text-gray-400">
              Fill in the details to help return the item to its owner
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6"
        >
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Images (Max 5)
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-xl border-2 border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previews.length < 5 && (
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-emerald-500 transition bg-gray-900/50">
                <FiUpload className="text-3xl text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-2">
                  {previews.length === 0
                    ? "Click to upload images"
                    : `Upload ${5 - previews.length} more image${5 - previews.length > 1 ? "s" : ""}`}
                </p>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="images"
                  className="inline-block bg-gray-700 text-gray-300 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-600 transition"
                >
                  Choose Images
                </label>
              </div>
            )}
          </div>

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
              placeholder="e.g., Black Wallet, iPhone 13, Calculator"
              disabled={uploading}
            />
          </div>

          {/* Category - Dynamic with fallback */}
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
              disabled={uploading}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location Found *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              disabled={uploading}
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Date Found */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date Found *
            </label>
            <input
              type="date"
              name="dateFound"
              value={formData.dateFound}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              disabled={uploading}
            />
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
              placeholder="Provide details like color, brand, distinctive features, etc."
              disabled={uploading}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className={`flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold transition ${
                loading || uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-emerald-500/20"
              }`}
            >
              {uploading
                ? "Uploading..."
                : loading
                  ? "Submitting..."
                  : "Report Found Item"}
            </button>
          </div>
        </form>
      </div>

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

export default ReportFound;
