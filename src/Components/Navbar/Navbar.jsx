import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishList";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import ProfileModal from "../../Common/ProfileModal";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems, getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileModalOpen(false);
    navigate("/login");
  };

  const navigateToGenderSection = (gender) => {
    navigate(`/shop?gender=${gender}`);
    setIsMobileMenuOpen(false);
  };

  const cartCount = getCartCount ? getCartCount() : cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = getWishlistCount ? getWishlistCount() : 0;

  return (
    <>
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? "bg-white border-b border-gray-200 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: Categories */}
            <div className="hidden lg:flex space-x-6">
              {["Women", "Men", "Kids"].map((category) => (
                <button
                  key={category}
                  onClick={() => navigateToGenderSection(category.toLowerCase())}
                  className="text-gray-900 hover:text-gray-600 font-medium transition text-sm uppercase tracking-wide"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" className="text-2xl font-bold text-gray-900 font-serif">
                Eleven
              </Link>
            </div>

            {/* Right: User & Icons */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative text-gray-900 hover:text-gray-600 transition duration-200">
                <FaRegHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative text-gray-900 hover:text-gray-600 transition duration-200">
                <MdOutlineShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Profile Button */}
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition duration-150 focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium hidden md:block">
                      {user?.name || "User"}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-900 hover:text-gray-600 text-sm font-medium transition duration-200">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              {/* Cart Icon - Mobile */}
              <Link to="/cart" className="relative text-gray-900">
                <MdOutlineShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-gray-900 focus:outline-none p-1"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-6 py-6 space-y-4">
              {/* Categories */}
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
                {["Women", "Men", "Kids"].map((category) => (
                  <button
                    key={category}
                    onClick={() => navigateToGenderSection(category.toLowerCase())}
                    className="block w-full text-left text-gray-900 font-medium text-base hover:text-gray-600 transition duration-200"
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Quick Links */}
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <Link 
                  to="/wishlist" 
                  className="flex items-center justify-between text-gray-900 hover:text-gray-600 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/cart" 
                  className="flex items-center justify-between text-gray-900 hover:text-gray-600 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Section */}
              <div className="space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Signed in</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="block w-full text-left text-gray-900 hover:text-gray-600 transition duration-200"
                    >
                      Profile Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left text-red-600 hover:text-red-700 transition duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block text-gray-900 hover:text-gray-600 transition duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block text-gray-900 hover:text-gray-600 transition duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;