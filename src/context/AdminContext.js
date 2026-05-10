import React, { createContext, useState, useContext, useCallback } from "react";
import { adminAPI } from "../utils/adminAPI";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if current user is admin
  const isAdmin = user?.role === "admin";

  // Get all users
  const fetchUsers = async () => {
    if (!isAdmin) return { success: false, error: "Not authorized" };

    setLoading(true);
    setError(null);
    try {
      console.log("Fetching users from API...");
      const data = await adminAPI.getAllUsers();
      console.log("Users API Response:", data);

      if (data.success) {
        setUsers(data.users || []);
        return { success: true, data };
      } else {
        setError(data.msg || "Failed to fetch users");
        return { success: false, error: data.msg };
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.msg || "Failed to fetch users");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (id, role) => {
    if (!isAdmin) return { success: false, error: "Not authorized" };

    setLoading(true);
    setError(null);
    try {
      console.log(`Updating user ${id} role to ${role}...`);
      const data = await adminAPI.updateUserRole(id, role);
      console.log("Update role response:", data);

      if (data.success) {
        setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
        return { success: true, data };
      } else {
        return { success: false, error: data.msg };
      }
    } catch (err) {
      console.error("Update user role error:", err);
      setError(err.msg || "Failed to update user role");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!isAdmin) return { success: false, error: "Not authorized" };

    setLoading(true);
    setError(null);
    try {
      console.log(`Deleting user ${id}...`);
      const data = await adminAPI.deleteUser(id);
      console.log("Delete user response:", data);

      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        return { success: true, data };
      } else {
        return { success: false, error: data.msg };
      }
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.msg || "Failed to delete user");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Get all items
  const fetchAllItems = async () => {
    if (!isAdmin) return { success: false, error: "Not authorized" };

    setLoading(true);
    setError(null);
    try {
      console.log("Fetching all items from API...");
      const data = await adminAPI.getAllItems();
      console.log("Items API Response:", data);

      if (data.success) {
        setItems(data.items || []);
        return { success: true, data };
      } else {
        return { success: false, error: data.msg };
      }
    } catch (err) {
      console.error("Fetch items error:", err);
      setError(err.msg || "Failed to fetch items");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    if (!isAdmin) return { success: false, error: "Not authorized" };

    setLoading(true);
    setError(null);
    try {
      console.log(`Deleting item ${id}...`);
      const data = await adminAPI.deleteItem(id);
      console.log("Delete item response:", data);

      if (data.success) {
        setItems((prev) => prev.filter((i) => i._id !== id));
        return { success: true, data };
      } else {
        return { success: false, error: data.msg };
      }
    } catch (err) {
      console.error("Delete item error:", err);
      setError(err.msg || "Failed to delete item");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Get stats
  const fetchStats = useCallback(async () => {
    if (!isAdmin) return { success: false, error: "Not authorized" };

    setLoading(true);
    setError(null);
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const data = await adminAPI.getStats(`?t=${timestamp}`);
      console.log("Stats API Response:", data);

      if (data.success) {
        setStats(data.stats);
        return { success: true, data };
      } else {
        return { success: false, error: data.msg };
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
      setError(err.msg || "Failed to fetch stats");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const value = {
    users,
    items,
    stats,
    loading,
    error,
    isAdmin,
    fetchUsers,
    fetchAllItems,
    fetchStats,
    updateUserRole,
    deleteUser,
    deleteItem,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
