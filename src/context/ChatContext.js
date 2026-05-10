import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from "axios";
import PropTypes from "prop-types";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [toast, setToast] = useState(null);

  // Update page title when unread count changes
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) CampusLost&Found`;
    } else {
      document.title = "CampusLost&Found";
    }
  }, [unreadCount]);

  useEffect(() => {
    if (user) {
      // Connect to socket with proper configuration
      const newSocket = io(
        "http://https://web-production-c29aa.up.railway.app",
        {
          transports: ["websocket", "polling"],
          withCredentials: true,
        },
      );
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("🔌 Socket connected:", newSocket.id);
        newSocket.emit("user-connected", user.id);
      });

      newSocket.on("online-users", (users) => {
        console.log("👥 Online users:", users);
        setOnlineUsers(users);
      });

      newSocket.on("new-message", (message) => {
        console.log("📨 New message received:", message);

        // Show toast notification if not in current chat
        if (currentChat?.user?._id !== message.fromUserId) {
          setToast({
            message: `💬 New message from ${message.fromUserName || "someone"}`,
            preview: message.message.substring(0, 50),
            senderId: message.fromUserId,
            senderName: message.fromUserName,
            id: Date.now(),
          });

          // Auto-hide toast after 4 seconds
          setTimeout(() => {
            setToast(null);
          }, 4000);
        }

        // Update current chat if open
        if (currentChat?.user?._id === message.fromUserId) {
          setMessages((prev) => [...prev, message]);
        }

        // Update unread count
        if (currentChat?.user?._id !== message.fromUserId) {
          fetchUnreadCount();
        }

        // Refresh conversations
        fetchConversations();
      });

      // Fetch initial data
      fetchConversations();
      fetchUnreadCount();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, currentChat]);

  const fetchConversations = async () => {
    try {
      // Use localStorage (not sessionStorage) for consistency with your auth
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://https://web-production-c29aa.up.railway.app/api/messages/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        console.log(
          "📋 Conversations loaded:",
          response.data.conversations.length,
        );
        setConversations(response.data.conversations);
      }
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  };

  const fetchMessages = async (otherUserId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://https://web-production-c29aa.up.railway.app/api/messages/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        setMessages(response.data.messages);
        // Mark as read when opening chat
        fetchUnreadCount();
        fetchConversations();
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://https://web-production-c29aa.up.railway.app/api/messages/unread/count",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (err) {
      console.error("Unread count error:", err);
    }
  };

  const sendMessage = (toUserId, message, itemId = null, itemName = "") => {
    if (socket && message.trim()) {
      const messageData = {
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId,
        message: message.trim(),
        itemId,
        itemName,
      };
      console.log("📤 Sending message:", messageData);
      socket.emit("send-message", messageData);
      setNewMessage("");

      // Optimistically add to messages
      const tempMessage = {
        _id: Date.now(),
        fromUserId: user.id,
        toUserId: toUserId,
        message: message.trim(),
        itemId,
        itemName,
        createdAt: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, tempMessage]);

      // Refresh conversations to update last message
      setTimeout(() => {
        fetchConversations();
      }, 500);
    }
  };

  const startChat = (otherUser, item = null) => {
    setCurrentChat({
      user: otherUser,
      item,
    });
    fetchMessages(otherUser._id);
  };

  const clearToast = () => {
    setToast(null);
  };

  const value = {
    socket,
    onlineUsers,
    conversations,
    unreadCount,
    currentChat,
    messages,
    loading,
    newMessage,
    setNewMessage,
    sendMessage,
    startChat,
    fetchConversations,
    fetchUnreadCount,
    toast,
    clearToast,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
