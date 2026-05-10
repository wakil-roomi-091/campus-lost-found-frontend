import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import PropTypes from "prop-types";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-w-full mx-4 transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
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
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default ConfirmModal;
