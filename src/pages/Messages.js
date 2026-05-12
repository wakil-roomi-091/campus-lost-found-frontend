/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState, memo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FiSend,
  FiMessageCircle,
  // FiUser,
  FiSearch,
  FiMoreVertical,
  FiCheck,
  FiTrash2,
  FiFlag,
  // FiUserX,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import Navbar from "../components/layout/Navbar";
import Modal from "../components/common/Modal";
import AlertModal from "../components/common/AlertModal";
import axios from "axios";

const MessageInput = memo(({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-3 md:p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500 text-sm md:text-base"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-2 md:p-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center"
        >
          <FiSend className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </form>
    </div>
  );
});

MessageInput.displayName = "MessageInput";

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    conversations,
    currentChat,
    messages,
    sendMessage,
    startChat,
    fetchConversations,
    fetchUnreadCount,
  } = useChat();

  const messagesEndRef = useRef(null);
  const sidebarMenuRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
    onConfirm: null,
  });

  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarMenuRef.current &&
        !sidebarMenuRef.current.contains(event.target)
      ) {
        setShowSidebarMenu(false);
      }
      if (showMessageMenu !== null) {
        setShowMessageMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessageMenu]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state && location.state.userId) {
      const otherUser = {
        _id: location.state.userId,
        name: location.state.userName || "User",
        email: location.state.userEmail || "",
        profilePicture: location.state.userProfilePicture || "",
      };
      const item = location.state.itemId
        ? {
            _id: location.state.itemId,
            itemName: location.state.itemName,
          }
        : null;

      startChat(otherUser, item);
      setIsMobileViewingChat(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (currentChat) {
      setIsMobileViewingChat(true);
    }
  }, [currentChat]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);

    if (msgDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (msgDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return msgDate.toLocaleDateString();
  };

  const handleSendMessage = (messageText) => {
    if (messageText.trim() && currentChat) {
      sendMessage(
        currentChat.user._id,
        messageText,
        currentChat.item?._id,
        currentChat.item?.itemName,
      );
    }
  };

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!conv.user || conv.user._id === user?.id) return false;
    return conv.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectChat = (chatUser) => {
    startChat(chatUser);
    setIsMobileViewingChat(true);
  };

  const handleBackToList = () => {
    setIsMobileViewingChat(false);
  };

  // ========== SIDEBAR MENU FUNCTIONS ==========

  const handleMarkAllRead = async () => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      title: "Mark All as Read",
      message: "Mark all conversations as read?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "https://web-production-c29aa.up.railway.app/api/messages/mark-all-read",
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          );
          await fetchConversations();
          await fetchUnreadCount();
          setModalConfig({ ...modalConfig, isOpen: false });
          setShowSidebarMenu(false);
          setAlertConfig({
            title: "Success",
            message: "All messages marked as read",
            type: "success",
          });
          setShowAlertModal(true);
        } catch (err) {
          console.error("Error marking all as read:", err);
        }
      },
    });
  };

  const handleClearAllChats = () => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "Clear All Chats",
      message: "Delete all conversations? This cannot be undone.",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            "https://web-production-c29aa.up.railway.app/api/messages/clear-all",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          await fetchConversations();
          setModalConfig({ ...modalConfig, isOpen: false });
          setShowSidebarMenu(false);
          setAlertConfig({
            title: "Success",
            message: "All chats cleared",
            type: "success",
          });
          setShowAlertModal(true);
        } catch (err) {
          console.error("Error clearing chats:", err);
        }
      },
    });
  };

  // ========== MESSAGE MENU FUNCTIONS ==========

  const handleDeleteMessage = async (messageId) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "Delete Message",
      message: "Delete this message?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `https://web-production-c29aa.up.railway.app/api/messages/${messageId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (currentChat) {
            startChat(currentChat.user, currentChat.item);
          }
        } catch (err) {
          console.error("Error deleting message:", err);
        }
        setModalConfig({ ...modalConfig, isOpen: false });
        setShowMessageMenu(null);
      },
    });
  };

  const handleReportMessage = (messageId, messageText) => {
    setModalConfig({
      isOpen: true,
      type: "report",
      title: "Report Message",
      message: "Report this message as inappropriate? Our team will review it.",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "https://web-production-c29aa.up.railway.app/api/reports/message",
            {
              messageId: messageId,
              messageContent: messageText,
              reportedUserId: currentChat.user._id,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setAlertConfig({
            title: "Report Submitted",
            message:
              "Thank you for reporting. Our team will review this message.",
            type: "success",
          });
          setShowAlertModal(true);
        } catch (err) {
          console.error("Error reporting message:", err);
        }
        setModalConfig({ ...modalConfig, isOpen: false });
        setShowMessageMenu(null);
      },
    });
  };

  // Sidebar Menu Component
  const SidebarMenu = () => (
    <div className="absolute top-14 right-4 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-50">
      <button
        onClick={handleMarkAllRead}
        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-t-xl flex items-center gap-2 transition"
        type="button"
      >
        <FiCheckCircle className="w-4 h-4 text-gray-500" />
        Mark all as read
      </button>
      <div className="border-t border-gray-700 my-1"></div>
      <button
        onClick={handleClearAllChats}
        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-b-xl flex items-center gap-2 transition"
        type="button"
      >
        <FiTrash2 className="w-4 h-4" />
        Clear all chats
      </button>
    </div>
  );

  // Message Menu Component
  const MessageMenu = ({ messageId, messageText, isOwn }) => (
    <div className="absolute right-0 top-6 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-50">
      {isOwn ? (
        <button
          onClick={() => handleDeleteMessage(messageId)}
          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-xl flex items-center gap-2 transition"
          type="button"
        >
          <FiTrash2 className="w-4 h-4" />
          Delete message
        </button>
      ) : (
        <button
          onClick={() => handleReportMessage(messageId, messageText)}
          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-xl flex items-center gap-2 transition"
          type="button"
        >
          <FiFlag className="w-4 h-4 text-gray-500" />
          Report message
        </button>
      )}
    </div>
  );

  // Chat List Component
  const ChatList = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Chats</h2>
          <div className="relative" ref={sidebarMenuRef}>
            <button
              onClick={() => setShowSidebarMenu(!showSidebarMenu)}
              className="p-2 hover:bg-gray-700 rounded-full transition"
            >
              <FiMoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            {showSidebarMenu && <SidebarMenu />}
          </div>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiMessageCircle className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Start a conversation by messaging someone
            </p>
          </div>
        ) : (
          filteredConversations.map((conv, index) => {
            if (!conv.user || conv.user._id === user?.id) return null;

            return (
              <div
                key={index}
                onClick={() => handleSelectChat(conv.user)}
                className="flex items-center gap-3 p-4 hover:bg-gray-700/50 cursor-pointer transition border-b border-gray-700"
              >
                <div className="relative flex-shrink-0">
                  {conv.user.profilePicture ? (
                    <img
                      src={conv.user.profilePicture}
                      alt={conv.user.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(conv.user.name)}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-white truncate">
                      {conv.user.name}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatDate(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs rounded-lg w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Chat Area Component (WITHOUT 3-dot menu)
  const ChatArea = () => (
    <div className="flex-1 flex flex-col bg-gray-900 h-full">
      <div className="bg-gray-800 border-b border-gray-700 px-4 md:px-6 py-3 flex items-center gap-3">
        <button
          onClick={handleBackToList}
          className="md:hidden p-2 hover:bg-gray-700 rounded-full transition text-gray-400"
        >
          <FiArrowLeft size={20} />
        </button>

        <Link
          to={`/profile/${currentChat?.user?._id}`}
          className="flex items-center gap-3 group flex-1"
        >
          {currentChat?.user?.profilePicture ? (
            <img
              src={currentChat.user.profilePicture}
              alt={currentChat.user.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
              {getInitials(currentChat?.user?.name)}
            </div>
          )}
          <div>
            <p className="font-semibold text-white group-hover:text-emerald-400 transition text-sm md:text-base">
              {currentChat?.user?.name}
            </p>
            {currentChat?.item && (
              <p className="text-xs text-gray-400 hidden md:block">
                Regarding: {currentChat.item.itemName}
              </p>
            )}
          </div>
        </Link>

        {/* 3-dot menu removed - no more ChatMenu button */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <FiMessageCircle className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-center text-sm md:text-base">
              No messages yet
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isOwn = msg.fromUserId === user.id;
              const showDate =
                index === 0 ||
                new Date(msg.createdAt).toDateString() !==
                  new Date(messages[index - 1]?.createdAt).toDateString();

              return (
                <div key={msg._id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} relative group`}
                  >
                    {!isOwn && (
                      <div className="flex-shrink-0 mr-2 hidden md:block">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(currentChat?.user?.name)}
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 py-2 md:px-4 md:py-2 ${
                        isOwn
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                          : "bg-gray-800 text-gray-200 shadow-sm border border-gray-700"
                      }`}
                    >
                      <p className="text-sm md:text-base break-words">
                        {msg.message}
                      </p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwn ? "text-emerald-200" : "text-gray-500"
                        }`}
                      >
                        <span className="text-xs">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isOwn && <FiCheck className="w-3 h-3" />}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setShowMessageMenu(
                          showMessageMenu === msg._id ? null : msg._id,
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 transition ml-2 self-center p-1 hover:bg-gray-800 rounded-full"
                    >
                      <FiMoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {showMessageMenu === msg._id && (
                      <MessageMenu
                        messageId={msg._id}
                        messageText={msg.message}
                        isOwn={isOwn}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden h-[calc(100vh-100px)]">
          <div className="hidden md:flex h-full">
            <div className="w-80 lg:w-96 border-r border-gray-700 bg-gray-800 flex flex-col">
              <ChatList />
            </div>
            <div className="flex-1 flex flex-col bg-gray-900">
              {currentChat ? (
                <ChatArea />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiMessageCircle className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      Your Messages
                    </h3>
                    <p className="text-gray-400 mt-1 max-w-md">
                      Select a conversation from the sidebar to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden h-full">
            {!isMobileViewingChat || !currentChat ? <ChatList /> : <ChatArea />}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Confirm"
        cancelText="Cancel"
      />

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

export default Messages;
