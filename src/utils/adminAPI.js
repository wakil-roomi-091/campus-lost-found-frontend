import axios from "axios";

const API_URL = "http://https://web-production-c29aa.up.railway.app/api";

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

export const adminAPI = {
  // User management
  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUser: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Item management
  getAllItems: async () => {
    try {
      const response = await api.get("/admin/items");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/admin/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Stats
  getStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
