import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiMail,
  FiArrowLeft,
  FiMessageSquare,
  FiCheckCircle,
  FiStar,
  FiPackage,
  FiInfo,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import Navbar from "../components/layout/Navbar";
import RatingModal from "../components/common/RatingModal";
import ConfirmModal from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchItemById, updateItem, currentItem, loading } = useItems();
  const [showContact, setShowContact] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const [canRate, setCanRate] = useState(false);

  const isOwner =
    user &&
    (currentItem?.userId?._id === user.id || currentItem?.userId === user.id);

  const images = currentItem?.images || [];

  useEffect(() => {
    loadItem();
  }, [id]);

  useEffect(() => {
    const checkCanRate = async () => {
      if (user && !isOwner && currentItem?.status === "resolved") {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://https://web-production-c29aa.up.railway.app/api/ratings/item/${currentItem._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setCanRate(!response.data.rating);
        } catch (err) {
          setCanRate(true);
        }
      }
    };
    checkCanRate();
  }, [user, currentItem, isOwner]);

  const loadItem = async () => {
    const result = await fetchItemById(id);
    if (result.success && result.data.item) {
      console.log("Item loaded:", result.data.item);
      if (result.data.item.images && result.data.item.images.length > 0) {
        setSelectedImage(result.data.item.images[0]);
      }
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowContact(true);
  };

  const handleMessage = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const ownerId = currentItem.userId?._id || currentItem.userId;
    if (ownerId === user.id) {
      setAlertConfig({
        title: "Cannot Message",
        message: "You cannot message yourself about your own item",
        type: "warning",
      });
      setShowAlertModal(true);
      return;
    }

    navigate("/messages", {
      state: {
        userId: ownerId,
        userName: currentItem.userId?.name || "User",
        userEmail: currentItem.userId?.email || "",
        itemId: currentItem._id,
        itemName: currentItem.itemName,
      },
    });
  };

  const handleMarkResolved = async () => {
    setShowConfirmModal(false);
    const result = await updateItem(id, { status: "resolved" });
    if (result.success) {
      setAlertConfig({
        title: "Success!",
        message: "Item marked as resolved successfully!",
        type: "success",
      });
      setShowAlertModal(true);
      loadItem();
    } else {
      setAlertConfig({
        title: "Error",
        message: "Failed to mark item as resolved",
        type: "error",
      });
      setShowAlertModal(true);
    }
  };

  const handleRateTransaction = async (rating, review) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://https://web-production-c29aa.up.railway.app/api/ratings",
        {
          toUserId: currentItem.userId?._id,
          itemId: currentItem._id,
          rating,
          review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setAlertConfig({
          title: "Thank You!",
          message: "Your rating has been submitted successfully!",
          type: "success",
        });
        setShowAlertModal(true);
        setCanRate(false);
      }
    } catch (err) {
      setAlertConfig({
        title: "Error",
        message: err.response?.data?.msg || "Failed to submit rating",
        type: "error",
      });
      setShowAlertModal(true);
    }
  };

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setShowFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setFullscreenIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setFullscreenIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showFullscreen) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreen, images.length]);

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

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiPackage
                className="w-10 h-10 text-gray-500"
                aria-hidden="true"
              />
            </div>
            <p className="text-gray-400 mb-4">Item not found</p>
            <Link
              to="/search"
              className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition mb-4"
          aria-label="Go back"
        >
          <FiArrowLeft aria-hidden="true" /> Back
        </button>

        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="md:flex">
            {/* Image Gallery Section - Left Side */}
            <div className="md:w-1/2 p-6">
              {/* Main Image Display */}
              <div
                className="mb-4 cursor-pointer group relative"
                onClick={() =>
                  images.length > 0 &&
                  openFullscreen(
                    images.findIndex((img) => img === selectedImage) >= 0
                      ? images.findIndex((img) => img === selectedImage)
                      : 0,
                  )
                }
              >
                {images.length > 0 ? (
                  <>
                    <img
                      src={selectedImage || images[0]}
                      alt={`${currentItem.itemName} - Main image`}
                      loading="eager"
                      decoding="sync"
                      className="w-full h-96 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        e.target.src = "/favicon.png";
                        e.target.onerror = null;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300 flex items-center justify-center">
                      <div className="bg-gray-800/90 p-3 rounded-full">
                        <FiZoomIn
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-96 bg-gray-900 rounded-xl shadow-lg flex items-center justify-center border border-gray-700">
                    <FiPackage
                      className="w-16 h-16 text-gray-600"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Grid with Navigation */}
              {images.length > 1 && (
                <div className="relative">
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`border-2 rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                          selectedImage === img
                            ? "border-emerald-500 ring-2 ring-emerald-500/50"
                            : "border-gray-700 hover:border-gray-500"
                        }`}
                        aria-label={`View image ${index + 1} of ${images.length}`}
                      >
                        <img
                          src={img}
                          alt={`${currentItem.itemName} - Thumbnail ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-20 object-cover"
                          onError={(e) => {
                            e.target.src = "/favicon.png";
                            e.target.onerror = null;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Count Badge */}
              {images.length > 0 && (
                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-500">
                    {images.length} image{images.length > 1 ? "s" : ""} • Click
                    image to enlarge
                  </span>
                </div>
              )}
            </div>

            {/* Details Section - Right Side */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-white">
                  {currentItem.itemName}
                </h1>
                <span
                  className={`text-sm px-3 py-1 rounded-lg font-medium ${
                    currentItem.type === "lost"
                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  }`}
                >
                  {currentItem.type === "lost" ? "Lost" : "Found"}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FiMapPin
                      className="text-emerald-400"
                      size={14}
                      aria-hidden="true"
                    />
                  </div>
                  <span>
                    Location:{" "}
                    <span className="font-medium text-white">
                      {currentItem.location}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FiCalendar
                      className="text-emerald-400"
                      size={14}
                      aria-hidden="true"
                    />
                  </div>
                  <span>
                    Date:{" "}
                    <span className="font-medium text-white">
                      {new Date(currentItem.date).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FiUser
                      className="text-emerald-400"
                      size={14}
                      aria-hidden="true"
                    />
                  </div>
                  <span>Posted by: </span>
                  <Link
                    to={`/profile/${currentItem.userId?._id || currentItem.userId}`}
                    className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    {currentItem.userId?.name || "Anonymous"}
                  </Link>
                </div>

                {currentItem.status && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        currentItem.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : currentItem.status === "resolved"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      Status: {currentItem.status}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FiInfo className="text-emerald-400" aria-hidden="true" />{" "}
                  Description
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {currentItem.description}
                </p>
              </div>

              {/* Contact Section - Only for non-owners */}
              {!isOwner && (
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={handleContact}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                      aria-label="Contact owner"
                    >
                      Contact Owner
                    </button>
                    <button
                      onClick={handleMessage}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                      aria-label="Send message"
                    >
                      <FiMessageSquare aria-hidden="true" />
                      Message
                    </button>
                  </div>

                  {showContact && (
                    <div className="mt-4 space-y-3">
                      <h3 className="text-lg font-semibold text-white">
                        Contact Information
                      </h3>
                      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 space-y-2">
                        <p className="flex items-center gap-2 text-gray-400">
                          <FiUser
                            className="text-emerald-400"
                            aria-hidden="true"
                          />
                          <span>{currentItem.userId?.name || "Anonymous"}</span>
                        </p>
                        <p className="flex items-center gap-2 text-gray-400">
                          <FiMail
                            className="text-emerald-400"
                            aria-hidden="true"
                          />
                          <a
                            href={`mailto:${currentItem.userId?.email}`}
                            className="text-emerald-400 hover:text-emerald-300 hover:underline"
                          >
                            {currentItem.userId?.email || "N/A"}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Manage Item
                  </h3>
                  <div className="flex gap-3">
                    <Link
                      to={`/edit-item/${currentItem._id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-xl hover:shadow-lg text-center"
                    >
                      Edit Item
                    </Link>
                    {currentItem.status !== "resolved" && (
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
                        aria-label="Mark item as resolved"
                      >
                        <FiCheckCircle aria-hidden="true" />
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Rate Transaction Button */}
              {!isOwner && currentItem?.status === "resolved" && canRate && (
                <div className="border-t border-gray-700 pt-6 mt-4">
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
                    aria-label="Rate this transaction"
                  >
                    <FiStar aria-hidden="true" /> Rate Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Slider Modal */}
      {showFullscreen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-10 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full transition"
            aria-label="Close fullscreen view"
          >
            <FiX className="w-6 h-6 text-white" aria-hidden="true" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-gray-800/80 px-3 py-1 rounded-full">
            <span className="text-white text-sm">
              {fullscreenIndex + 1} / {images.length}
            </span>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 z-10 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full transition"
              aria-label="Previous image"
            >
              <FiChevronLeft
                className="w-8 h-8 text-white"
                aria-hidden="true"
              />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 z-10 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full transition"
              aria-label="Next image"
            >
              <FiChevronRight
                className="w-8 h-8 text-white"
                aria-hidden="true"
              />
            </button>
          )}

          {/* Main Image */}
          <img
            src={images[fullscreenIndex]}
            alt={`${currentItem.itemName} - Fullscreen view`}
            loading="eager"
            decoding="sync"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.target.src = "/favicon.png";
              e.target.onerror = null;
            }}
          />

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs">
            {images.length > 1 && "← →  to navigate • ESC to close"}
          </div>
        </div>
      )}

      {/* Confirm Modal for Mark Resolved */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleMarkResolved}
        title="Mark as Resolved"
        message="Are you sure you want to mark this item as resolved? This will allow the other user to rate the transaction."
        confirmText="Yes, Mark Resolved"
        cancelText="Cancel"
      />

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRateTransaction}
        userName={currentItem.userId?.name || "User"}
        itemName={currentItem.itemName}
      />

      {/* Alert Modal for Success/Error Messages */}
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

export default ItemDetails;
