import React from "react";
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import PropTypes from "prop-types";

const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  onConfirm = null,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <FiInfo className="w-6 h-6 text-blue-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            onClick={onConfirm || onClose}
            className={`px-4 py-1.5 text-sm text-white rounded-md transition font-medium ${getButtonColor()}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  onConfirm: PropTypes.func,
};

export default AlertModal;
