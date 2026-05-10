// Disable console logs in production for better performance
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

import axios from "axios";

const API_URL = "https://web-production-c29aa.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Items API
export const itemsAPI = {
  getAllItems: async (filters = {}) => {
    try {
      const response = await api.get("/items", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getItemById: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createItem: async (itemData) => {
    try {
      // Only log in development
      if (process.env.NODE_ENV !== "production") {
        console.log("\n========== 🌐 API CALL ==========");
        console.log("📤 POST /items");
        console.log("📦 Payload:", {
          ...itemData,
          images: itemData.images,
          imageCount: itemData.images?.length,
        });
      }

      const response = await api.post("/items", itemData);

      if (process.env.NODE_ENV !== "production") {
        console.log("📥 Response status:", response.status);
        console.log("📥 Response data:", response.data);
        console.log("========== 🏁 API END ==========\n");
      }

      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("🌐 API Error:", error.response?.data || error.message);
      }
      throw error.response?.data || error.message;
    }
  },

  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserItems: async () => {
    try {
      const response = await api.get("/items/user/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ========== CONTACT API (Complete) ==========
export const contactAPI = {
  // Send a new contact message (Public)
  sendMessage: async (formData) => {
    try {
      const response = await api.post("/contact/send", formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all contact messages (Admin only)
  getAllMessages: async (page = 1, limit = 20, status = "all") => {
    try {
      const response = await api.get(
        `/contact/admin/messages?page=${page}&limit=${limit}&status=${status}`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single message by ID (Admin only)
  getMessage: async (id) => {
    try {
      const response = await api.get(`/contact/admin/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update message status (Admin only)
  updateStatus: async (id, status, adminNote = "") => {
    try {
      const response = await api.put(`/contact/admin/messages/${id}/status`, {
        status,
        adminNote,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reply to a message (Admin only)
  replyToMessage: async (id, replyMessage) => {
    try {
      const response = await api.post(`/contact/admin/messages/${id}/reply`, {
        replyMessage,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a message (Admin only)
  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/contact/admin/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get statistics (Admin only)
  getStats: async () => {
    try {
      const response = await api.get("/contact/admin/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
// ========== END CONTACT API ==========

export default api;
