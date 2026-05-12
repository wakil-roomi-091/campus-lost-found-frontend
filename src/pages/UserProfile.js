import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiPackage,
  FiArrowLeft,
  FiLogOut,
  FiEdit2,
  FiClock,
  FiAward,
  FiStar,
  // FiTrendingUp,
  FiMessageSquare,
} from "react-icons/fi";
import { FaRegFrown, FaRegSmile } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import axios from "axios";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("items");
  const [setRatingsLoading] = useState(false);
  // const [ratingsPage, setRatingsPage] = useState(1);
  const [setRatingsTotal] = useState(0);

  useEffect(() => {
    fetchUserProfile();
    fetchUserItems();
    fetchUserRatings();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `https://web-production-c29aa.up.railway.app/api/users/profile/${id}`,
      );
      if (response.data.success) {
        setProfileUser(response.data.user);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to load user profile");
    }
  };

  const fetchUserItems = async () => {
    try {
      const response = await axios.get(
        `https://web-production-c29aa.up.railway.app/api/items/user/${id}`,
      );
      if (response.data.success) {
        setUserItems(response.data.items || []);
      }
    } catch (err) {
      console.error("Error fetching user items:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async (page = 1) => {
    setRatingsLoading(true);
    try {
      const response = await axios.get(
        `https://web-production-c29aa.up.railway.app/api/ratings/user/${id}?page=${page}`,
      );
      if (response.data.success) {
        setRatings(response.data.ratings);
        setRatingsTotal(response.data.total);
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    } finally {
      setRatingsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMessage = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    navigate("/messages", {
      state: {
        userId: profileUser._id,
        userName: profileUser.name,
        userEmail: profileUser.email,
      },
    });
  };

  const isOwnProfile = currentUser?.id === profileUser?._id;
  const joinDate = profileUser
    ? new Date(profileUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "";

  const lostCount = userItems.filter((item) => item.type === "lost").length;
  const foundCount = userItems.filter((item) => item.type === "found").length;
  const resolvedCount = userItems.filter(
    (item) => item.status === "resolved",
  ).length;

  const statCards = [
    {
      label: "Total Items",
      value: userItems.length,
      icon: FiPackage,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Lost Items",
      value: lostCount,
      icon: FaRegFrown,
      gradient: "from-red-500 to-rose-500",
    },
    {
      label: "Found Items",
      value: foundCount,
      icon: FaRegSmile,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Resolved",
      value: resolvedCount,
      icon: FiAward,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-emerald-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiUser className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              {error || "The user you're looking for doesn't exist"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl mb-8 border border-gray-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl border-4 border-gray-700 shadow-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600">
                  {profileUser.profilePicture ? (
                    <img
                      src={profileUser.profilePicture}
                      alt={profileUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {profileUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">
                    {profileUser.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      profileUser.role === "admin"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                        : "bg-gray-700 text-emerald-400"
                    }`}
                  >
                    {profileUser.role === "admin"
                      ? "Administrator"
                      : "Community Member"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <FiCalendar className="text-emerald-400" size={14} />
                    Joined {joinDate}
                  </span>
                  {profileUser.location && (
                    <span className="text-gray-400 flex items-center gap-1">
                      <FiMapPin className="text-emerald-400" size={14} />
                      {profileUser.location}
                    </span>
                  )}
                  {profileUser.email && (
                    <span className="text-gray-400 flex items-center gap-1">
                      <FiMail className="text-emerald-400" size={14} />
                      {profileUser.email}
                    </span>
                  )}
                </div>

                {/* Rating Display */}
                {profileUser.totalRatings > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(profileUser.averageRating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {profileUser.averageRating?.toFixed(1)} out of 5
                    </span>
                    <span className="text-sm text-gray-400">
                      ({profileUser.totalRatings} reviews)
                    </span>
                  </div>
                )}

                {/* Bio */}
                {profileUser.bio && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    <p className="text-gray-300 italic text-sm">
                      &quot;{profileUser.bio}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => navigate("/edit-profile")}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    >
                      <FiEdit2 size={16} /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    >
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleMessage}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    >
                      <FiMessageSquare size={16} /> Message
                    </button>
                    <button className="px-5 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 text-sm font-medium">
                      Connect
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid - Dark */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="group bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-700"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-xs text-gray-400 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab("items")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                  activeTab === "items"
                    ? "text-emerald-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Items ({userItems.length})
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                  activeTab === "about"
                    ? "text-emerald-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                  activeTab === "reviews"
                    ? "text-emerald-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Reviews ({profileUser.totalRatings || 0})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "items" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userItems.length === 0 ? (
                  <div className="col-span-3 text-center py-12">
                    <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiPackage className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400">
                      {isOwnProfile
                        ? "You haven't posted any items yet"
                        : "No items to display"}
                    </p>
                    {isOwnProfile && (
                      <div className="flex gap-4 justify-center mt-4">
                        <Link
                          to="/report-lost"
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm hover:shadow-lg transition-all duration-300"
                        >
                          Report Lost
                        </Link>
                        <Link
                          to="/report-found"
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm hover:shadow-lg transition-all duration-300"
                        >
                          Report Found
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  userItems.map((item) => (
                    <Link
                      key={item._id}
                      to={`/item/${item._id}`}
                      className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="h-40 bg-gray-700 relative overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.itemName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiPackage className="w-10 h-10 text-gray-500" />
                          </div>
                        )}
                        <span
                          className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-lg font-medium shadow-lg ${
                            item.type === "lost"
                              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                          }`}
                        >
                          {item.type === "lost" ? "Lost" : "Found"}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-white group-hover:text-emerald-400 transition truncate">
                          {item.itemName}
                        </h4>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                          <FiMapPin className="text-gray-500" size={12} />{" "}
                          {item.location}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FiClock size={12} />{" "}
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-lg ${
                              item.status === "active"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                    <FiUser size={14} /> About
                  </h4>
                  <p className="text-gray-300">
                    {profileUser.bio || "No bio added yet."}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                    <FiCalendar size={14} /> Member Since
                  </h4>
                  <p className="text-gray-300">{joinDate}</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                    <FiAward size={14} /> Account Type
                  </h4>
                  <p className="text-gray-300 capitalize">{profileUser.role}</p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {ratings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiStar className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {ratings.map((rating) => (
                      <div
                        key={rating._id}
                        className="bg-gray-700/30 rounded-xl p-4 border border-gray-700"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                            {rating.fromUserId?.name?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">
                              {rating.fromUserId?.name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= rating.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {rating.review && (
                          <p className="text-sm text-gray-300 ml-13">
                            {rating.review}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2 ml-13">
                          Item: {rating.itemId?.itemName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
