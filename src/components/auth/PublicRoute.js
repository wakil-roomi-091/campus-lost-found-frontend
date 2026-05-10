import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PropTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const { user, initialLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-emerald-500"></div>
        </div>
      </div>
    );
  }

  // Check if there's a force parameter in the URL
  const searchParams = new URLSearchParams(location.search);
  const forceRegister = searchParams.get("force") === "true";

  if (user && !forceRegister) {
    // User already logged in and not forcing register, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Add PropTypes validation
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
