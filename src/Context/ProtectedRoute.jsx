import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // if not logged in
  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  // if logged in
  return children;
};

export default ProtectedRoute;
