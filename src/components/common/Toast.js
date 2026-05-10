import React, { useEffect } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";
import PropTypes from "prop-types";

const Toast = ({ message, preview, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-xl shadow-2xl border border-emerald-500/30 p-4 max-w-sm cursor-pointer hover:shadow-lg transition-all duration-300"
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <FiMessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm">{message}</p>
          {preview && (
            <p className="text-gray-400 text-xs mt-1 truncate">{preview}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  preview: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

Toast.defaultProps = {
  preview: null,
  onClick: null,
};

export default Toast;