
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import AdminLayout from "../../Components/Admin/Layout/AdminLayout";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not logged in
  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  // If user is not admin
  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
    // Or redirect to home: return <Navigate to="/" replace />;
  }

  // If user is admin, render with admin layout
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminRoute;