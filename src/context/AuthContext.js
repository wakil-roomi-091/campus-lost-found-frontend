import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../utils/api";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check if user is logged in on page load - NO BACKEND VERIFICATION
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // Set axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      }
      setInitialLoading(false);
    };

    checkUser();
  }, []);

  // Register user - NO AUTO LOGIN
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register(userData);
      if (data.success) {
        return { success: true, data };
      } else {
        setError(data.msg || "Registration failed");
        return { success: false, error: data.msg };
      }
    } catch (err) {
      const errorMsg = err.msg || "Registration failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login user - WITH COMPLETE USER DATA
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      console.log("Login response data:", data);

      if (data.success) {
        // Store COMPLETE user data including all profile fields
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || "user",
          profilePicture: data.user.profilePicture || "",
          coverPhoto: data.user.coverPhoto || "",
          bio: data.user.bio || "",
          location: data.user.location || "",
          phone: data.user.phone || "",
          socialLinks: data.user.socialLinks || {},
        };

        console.log("User data being stored:", userData);

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return { success: true, data };
      } else {
        setError(data.msg || "Login failed");
        return { success: false, error: data.msg };
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.msg || "Login failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // ========== NEW: Google Login Method ==========
  const googleLogin = (userData, token) => {
    console.log("🔐 Google Login - User data:", userData);
    console.log("🔐 Google Login - Token:", token ? "Received" : "Missing");

    // Store token
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Store user data
    const userToStore = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      profilePicture: userData.profilePicture || "",
      coverPhoto: userData.coverPhoto || "",
      bio: userData.bio || "",
      location: userData.location || "",
      phone: userData.phone || "",
      socialLinks: userData.socialLinks || {},
      authProvider: "google",
    };

    localStorage.setItem("user", JSON.stringify(userToStore));
    setUser(userToStore);

    console.log("✅ Google login successful!");
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Update user data in context and localStorage
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  // Check if current user is admin
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    loading,
    error,
    initialLoading,
    register,
    login,
    googleLogin,
    logout,
    updateUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
