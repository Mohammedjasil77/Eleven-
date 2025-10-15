// src/Routes/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    // Redirect admin and user separately if needed
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
