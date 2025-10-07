import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishList";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    navigate("/login");
  };

  const navigateToGenderSection = (gender) => {
    navigate(`/shop?gender=${gender}`);
    setIsMobileMenuOpen(false);
  };

  const cartCount = getCartCount ? getCartCount() : cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = getWishlistCount ? getWishlistCount() : 0;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white border-b border-gray-200 shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Categories */}
          <div className="hidden lg:flex space-x-6">
            {["Women", "Men", "Kids"].map((category) => (
              <button
                key={category}
                onClick={() => navigateToGenderSection(category.toLowerCase())}
                className="text-gray-900 hover:text-gray-600 font-medium transition"
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Eleven
            </Link>
          </div>

          {/* Right: User & Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/wishlist" className="relative text-gray-900 hover:text-gray-600">
              <FaRegHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-gray-900 hover:text-gray-600">
              <MdOutlineShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <span className="text-gray-900">Hello, {user.name}</span>
                <button onClick={handleLogout} className="text-gray-900 hover:text-gray-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-900 hover:text-gray-600">Login</Link>
                <Link to="/register" className="text-gray-900 hover:text-gray-600">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-900">
              <MdOutlineShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-900 focus:outline-none">
              {isMobileMenuOpen ? "✖️" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-6 space-y-4">
            {["Women", "Men", "Kids"].map((category) => (
              <button
                key={category}
                onClick={() => navigateToGenderSection(category.toLowerCase())}
                className="block w-full text-left text-gray-900 font-medium text-lg"
              >
                {category}
              </button>
            ))}
            <Link to="/wishlist" className="block text-gray-900">Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
            <Link to="/cart" className="block text-gray-900">Cart {cartCount > 0 && `(${cartCount})`}</Link>

            {user ? (
              <>
                <span className="block text-gray-900">Hello, {user.name}</span>
                <button onClick={handleLogout} className="text-gray-900">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-900">Login</Link>
                <Link to="/register" className="block text-gray-900">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
