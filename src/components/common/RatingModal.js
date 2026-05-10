import React, { useState } from "react";
import { FiStar, FiX } from "react-icons/fi";
import PropTypes from "prop-types";

const RatingModal = ({ isOpen, onClose, onSubmit, userName, itemName }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);
    await onSubmit(rating, review);
    setSubmitting(false);
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-w-full mx-4">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Rate Your Experience
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-600 mb-4">
            How was your experience with{" "}
            <span className="font-semibold">{userName}</span> regarding{" "}
            <span className="font-semibold">{itemName}</span>?
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <FiStar
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Review Textarea */}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience (optional)..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 p-5 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

RatingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
};

export default RatingModal;
