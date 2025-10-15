import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // ✅ Check if blocked
        if (userData.isBlock) {
          alert("⚠️ Your account has been blocked by admin.");
          handleLogout();
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ✅ Login function
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    if (userData.isBlock) {
      alert("⚠️ Your account has been blocked by admin.");
      handleLogout();
    }
  };

  // ✅ Logout function - FIXED: No navigate, just state + storage cleanup
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    setUser(null);
    
    // Dispatch event to notify all components
    window.dispatchEvent(new Event("authChange"));
  };

  // ✅ Check if user is authenticated (computed value)
  const isAuthenticated = !!user && !user.isBlock;

  const value = {
    user,
    login,
    logout: handleLogout,
    loading,
    isAuthenticated,
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