// src/Layout/AdminLayout.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo & Navigation */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              {/* Logo/Brand */}
              <Link 
                to="/admin" 
                className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition duration-300"
                onClick={closeMobileMenu}
              >
                Eleven Admin 
              </Link>
              
              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex space-x-2 ml-4">
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    isActiveRoute('/admin') && location.pathname === '/admin'
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/users" 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    isActiveRoute('/admin/users')
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Users
                </Link>
                <Link 
                  to="/admin/products" 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    isActiveRoute('/admin/products')
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Products
                </Link>
                <Link 
                  to="/admin/orders" 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    isActiveRoute('/admin/orders')
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Orders
                </Link>
              </nav>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-md transition duration-300"
              >
                <span className="mr-2">🏪</span>
                View Store
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium bg-red-600 text-white px-4 py-2 hover:bg-red-700 rounded-md transition duration-300"
              >
                <span className="mr-2">🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                <Link
                  to="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActiveRoute('/admin') && location.pathname === '/admin'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActiveRoute('/admin/users')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Users
                </Link>
                <Link
                  to="/admin/products"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActiveRoute('/admin/products')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActiveRoute('/admin/orders')
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    navigate("/");
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition duration-300"
                >
                  <span className="flex items-center">
                    <span className="mr-3">🏪</span>
                    View Store
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-2 md:mb-0">
              © 2024 Eleven Store Admin Panel
            </p>
            <div className="flex space-x-4 text-xs text-gray-400">
              <span>Version 1.0</span>
              <span>•</span>
              <span>Admin User</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;