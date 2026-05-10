import React, { useEffect, useRef } from "react";
import { FiX, FiAlertCircle, FiTrash2, FiFlag, FiUserX } from "react-icons/fi";
import PropTypes from "prop-types";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <FiTrash2 className="w-5 h-5 text-red-500" />;
      case "report":
        return <FiFlag className="w-5 h-5 text-orange-500" />;
      case "block":
        return <FiUserX className="w-5 h-5 text-red-500" />;
      default:
        return <FiAlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-80 transform transition-all animate-in fade-in zoom-in duration-200"
      >
        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded-full transition"
            >
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-sm text-white rounded-md transition font-medium ${
              type === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : type === "report"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : type === "block"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["warning", "danger", "report", "block"]),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default Modal;
