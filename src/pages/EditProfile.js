import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  // FiMail,
  FiMapPin,
  FiPhone,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiSave,
  FiArrowLeft,
  FiCamera,
  FiLoader,
  FiInfo,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

// Your Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dspcl9tug";
const CLOUDINARY_UPLOAD_PRESET = "campus_lost_found";

// ✅ Create a CLEAN axios instance for Cloudinary (NO interceptors)
const cloudinaryAxios = axios.create();

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

    setFormData({
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      phone: user.phone || "",
      socialLinks: user.socialLinks || {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
    });

    setProfilePreview(user.profilePicture || "");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // ✅ FIXED: Using clean axios instance for Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      console.log(`📤 Uploading profile image to Cloudinary...`);

      // USING THE CLEAN AXIOS INSTANCE WITHOUT INTERCEPTORS
      const response = await cloudinaryAxios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: false,
        },
      );

      console.log(`✅ Upload successful:`, response.data.secure_url);
      return response.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      console.error("Error details:", err.response?.data || err.message);
      throw new Error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Upload profile picture if changed
      if (profilePicture) {
        try {
          const imageUrl = await uploadToCloudinary(profilePicture);
          console.log("📸 Sending profile picture URL to backend:", imageUrl);
          await axios.post(
            "https://web-production-c29aa.up.railway.app/api/profile/picture",
            { imageUrl },
            { headers: { Authorization: `Bearer ${token}` } },
          );
        } catch (imgErr) {
          console.error("Profile picture upload failed:", imgErr);
        }
      }

      // Update profile info
      const profileResponse = await axios.put(
        "https://web-production-c29aa.up.railway.app/api/profile/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (profileResponse.data.success) {
        // Fetch COMPLETE updated user data from server
        const userResponse = await axios.get(
          `https://web-production-c29aa.up.railway.app/api/users/profile/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (userResponse.data.success) {
          const updatedUser = userResponse.data.user;

          const completeUserData = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture || "",
            coverPhoto: updatedUser.coverPhoto || "",
            bio: updatedUser.bio || "",
            location: updatedUser.location || "",
            phone: updatedUser.phone || "",
            socialLinks: updatedUser.socialLinks || {},
          };

          updateUser(completeUserData);

          setAlertConfig({
            type: "success",
            title: "Success!",
            message: "Profile updated successfully!",
          });
          setShowAlert(true);

          setTimeout(() => {
            navigate(`/profile/${user.id}`, {
              replace: true,
              state: { refresh: Date.now() },
            });
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: err.response?.data?.msg || "Failed to update profile",
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-10 bg-gray-800 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-700"
      >
        <FiArrowLeft className="text-gray-400" />
      </button>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl mb-8 border border-gray-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                <p className="text-gray-400 text-sm">
                  Update your personal information
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Profile Picture
                  </h2>
                  <p className="text-sm text-gray-400">
                    Upload a profile photo
                  </p>
                </div>
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl border-4 border-gray-700 shadow-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-gray-900/80 rounded-2xl flex items-center justify-center">
                      <FiLoader className="w-6 h-6 text-emerald-400 animate-spin" />
                    </div>
                  )}
                  <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300">
                    <FiCamera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicture}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <FiInfo className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-400">
                    Update your basic details
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <FiFacebook className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Social Links
                  </h2>
                  <p className="text-sm text-gray-400">
                    Connect your social media profiles
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <FiFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) =>
                      handleSocialChange("facebook", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="Facebook URL"
                  />
                </div>

                <div className="relative">
                  <FiTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400" />
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) =>
                      handleSocialChange("twitter", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="Twitter URL"
                  />
                </div>

                <div className="relative">
                  <FiInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500" />
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) =>
                      handleSocialChange("instagram", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="Instagram URL"
                  />
                </div>

                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      handleSocialChange("linkedin", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
              loading || uploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>
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

export default EditProfile;
