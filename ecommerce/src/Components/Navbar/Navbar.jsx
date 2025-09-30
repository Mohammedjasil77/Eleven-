import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white border-b border-gray-100" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex space-x-8 items-center">
            <Link
              to="/shop"
              className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wider transition-colors duration-200"
            >
              WOMEN
            </Link>
            <Link
              to="/shop"
              className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wider transition-colors duration-200"
            >
              MEN
            </Link>
            <Link
              to="/shop"
              className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wider transition-colors duration-200"
            >
              KIDS
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-2xl font-serif font-bold text-gray-900 tracking-widest hover:opacity-80 transition-opacity duration-200"
            >
              ShoeStore
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link
              to="/search"
              className="text-gray-900 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              to="/wishlist"
              className="text-gray-900 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <Link
              to="/cart"
              className="text-gray-900 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
              </svg>
            </Link>
            {user ? (
              <div className="flex items-center space-x-4 ml-2">
                <span className="text-gray-900 text-sm font-light tracking-wide">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors duration-200"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-2">
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors duration-200"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors duration-200"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
              </svg>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="hidden lg:flex justify-center space-x-8 py-3 border-t border-gray-100">
          <Link
            to="/new-arrivals"
            className="text-gray-900 hover:text-gray-600 text-xs font-light tracking-widest uppercase transition-colors duration-200"
          >
            New Arrivals
          </Link>
          <Link
            to="/bestsellers"
            className="text-gray-900 hover:text-gray-600 text-xs font-light tracking-widest uppercase transition-colors duration-200"
          >
            Bestsellers
          </Link>
          <Link
            to="/sale"
            className="text-red-600 hover:text-red-700 text-xs font-light tracking-widest uppercase transition-colors duration-200"
          >
            Sale
          </Link>
          <Link
            to="/sustainability"
            className="text-gray-900 hover:text-gray-600 text-xs font-light tracking-widest uppercase transition-colors duration-200"
          >
            Sustainability
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-8 space-y-6">
            {/* Main Categories */}
            <div className="space-y-4">
              <Link
                to="/shop"
                className="block text-gray-900 text-lg font-light tracking-wide hover:text-gray-600 transition-colors duration-200"
              >
                Women
              </Link>
              <Link
                to="/shop"
                className="block text-gray-900 text-lg font-light tracking-wide hover:text-gray-600 transition-colors duration-200"
              >
                Men
              </Link>
              <Link
                to="/shop"
                className="block text-gray-900 text-lg font-light tracking-wide hover:text-gray-600 transition-colors duration-200"
              >
                Kids
              </Link>
            </div>

            {/* Secondary Links */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <Link
                to="/new-arrivals"
                className="block text-gray-900 text-sm font-light tracking-wider uppercase hover:text-gray-600 transition-colors duration-200"
              >
                New Arrivals
              </Link>
              <Link
                to="/bestsellers"
                className="block text-gray-900 text-sm font-light tracking-wider uppercase hover:text-gray-600 transition-colors duration-200"
              >
                Bestsellers
              </Link>
              <Link
                to="/sale"
                className="block text-red-600 text-sm font-light tracking-wider uppercase hover:text-red-700 transition-colors duration-200"
              >
                Sale
              </Link>
            </div>

            {/* Auth Section */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <span className="block text-gray-900 text-sm font-light tracking-wide">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="block text-gray-900 text-sm font-light tracking-wide hover:text-gray-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-900 text-sm font-light tracking-wide hover:text-gray-600 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-gray-900 text-sm font-light tracking-wide hover:text-gray-600 transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;