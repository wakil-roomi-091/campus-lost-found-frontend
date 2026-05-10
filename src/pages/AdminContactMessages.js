// client/src/pages/AdminContactMessages.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiMessageSquare,
  FiSend,
  FiTrash2,
  FiRefreshCw,
  FiInbox,
  FiFlag,
  FiUser,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import ConfirmModal from "../components/common/ConfirmModal";
import AlertModal from "../components/common/AlertModal";
import api from "../utils/api";

const AdminContactMessages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    unread: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchMessages();
      fetchStats();
    }
  }, [filter, pagination.page, user]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/contact/admin/messages?page=${pagination.page}&limit=${pagination.limit}&status=${filter}`,
      );
      if (response.data.success) {
        setMessages(response.data.messages);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/contact/admin/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const viewMessage = async (messageId) => {
    try {
      const response = await api.get(`/contact/admin/messages/${messageId}`);
      if (response.data.success) {
        setSelectedMessage(response.data.message);
        fetchMessages(); // Refresh list to update read status
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error viewing message:", error);
    }
  };

  const updateStatus = async (messageId, status, adminNote = "") => {
    try {
      await api.put(`/contact/admin/messages/${messageId}/status`, {
        status,
        adminNote,
      });
      fetchMessages();
      fetchStats();
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
      setAlertConfig({
        title: "Success",
        message: "Status updated successfully",
        type: "success",
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      setAlertConfig({
        title: "Error",
        message: "Please enter a reply message",
        type: "error",
      });
      setShowAlert(true);
      return;
    }

    try {
      await api.post(`/contact/admin/messages/${selectedMessage._id}/reply`, {
        replyMessage: replyText,
      });
      setShowReplyModal(false);
      setReplyText("");
      fetchMessages();
      fetchStats();
      setSelectedMessage(null);
      setAlertConfig({
        title: "Success",
        message: "Reply sent successfully!",
        type: "success",
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error sending reply:", error);
      setAlertConfig({
        title: "Error",
        message: "Failed to send reply",
        type: "error",
      });
      setShowAlert(true);
    }
  };

  const deleteMessage = async () => {
    try {
      await api.delete(`/contact/admin/messages/${messageToDelete}`);
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
      fetchMessages();
      fetchStats();
      setAlertConfig({
        title: "Success",
        message: "Message deleted successfully",
        type: "success",
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        color: "bg-yellow-500/20 text-yellow-400",
        icon: FiClock,
        text: "Pending",
      },
      "in-progress": {
        color: "bg-blue-500/20 text-blue-400",
        icon: FiRefreshCw,
        text: "In Progress",
      },
      resolved: {
        color: "bg-green-500/20 text-green-400",
        icon: FiCheckCircle,
        text: "Resolved",
      },
      spam: { color: "bg-red-500/20 text-red-400", icon: FiFlag, text: "Spam" },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${badge.color}`}
      >
        <Icon size={12} /> {badge.text}
      </span>
    );
  };

  const statCards = [
    {
      label: "Total Messages",
      value: stats.total,
      icon: FiInbox,
      color: "from-gray-500 to-gray-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: FiClock,
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: FiCheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Unread",
      value: stats.unread,
      icon: FiMail,
      color: "from-blue-500 to-cyan-500",
    },
  ];

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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Contact Messages
          </h1>
          <p className="text-gray-400">
            Manage user inquiries and support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-2xl p-4 border border-gray-700"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-3`}
              >
                <card.icon className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-sm text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "in-progress", "resolved", "spam"].map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setPagination({ ...pagination, page: 1 });
                }}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  filter === status
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Messages Table */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">
                    From
                  </th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">
                    Subject
                  </th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent mx-auto"></div>
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <FiInbox className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No messages found</p>
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr
                      key={message._id}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                    >
                      <td className="px-6 py-4">
                        {getStatusBadge(message.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {message.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {message.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{message.subject}</p>
                        <p className="text-gray-500 text-sm truncate max-w-xs">
                          {message.message.substring(0, 50)}...
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-400 text-sm">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewMessage(message._id)}
                            className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition"
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowReplyModal(true);
                            }}
                            className="p-2 text-green-400 hover:bg-gray-700 rounded-lg transition"
                            title="Reply"
                          >
                            <FiSend />
                          </button>
                          <button
                            onClick={() => {
                              setMessageToDelete(message._id);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-700">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
              >
                <FiChevronLeft className="text-white" />
              </button>
              <span className="text-gray-400">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
              >
                <FiChevronRight className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message Details Modal */}
      {selectedMessage && !showReplyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-sm">From</label>
                <p className="text-white font-medium">{selectedMessage.name}</p>
                <p className="text-gray-400 text-sm">{selectedMessage.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Subject</label>
                <p className="text-white">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Message</label>
                <div className="bg-gray-900 rounded-xl p-4 mt-1">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["pending", "in-progress", "resolved", "spam"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateStatus(selectedMessage._id, status)
                        }
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          selectedMessage.status === status
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        }`}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              </div>
              {selectedMessage.replyMessage && (
                <div>
                  <label className="text-gray-400 text-sm">Reply Sent</label>
                  <div className="bg-emerald-500/10 rounded-xl p-4 mt-1 border border-emerald-500/20">
                    <p className="text-gray-300">
                      {selectedMessage.replyMessage}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Sent on{" "}
                      {new Date(selectedMessage.repliedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium"
                >
                  Reply to User
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                Reply to {selectedMessage.name}
              </h2>
            </div>
            <div className="p-6">
              <textarea
                rows="6"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={sendReply}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium"
                >
                  Send Reply
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText("");
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteMessage}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

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

export default AdminContactMessages;
