import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create the context
export const AuthContext = createContext();

// 2. Create the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store logged-in user
  const [loading, setLoading] = useState(true); // Add loading state

  // Load user from localStorage when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user"); // Clear corrupted data
      }
    }
    setLoading(false); // Loading complete
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    loading, // Add loading to context value
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};