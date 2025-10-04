import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext"; // make sure this path exists
import { FaRegHeart } from "react-icons/fa"; // wishlist outline
import { MdOutlineShoppingCart } from "react-icons/md"; // cart outline



const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);
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

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white border-b border-gray-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex space-x-8 items-center">
            <Link to="/shop" className="text-gray-900 hover:text-gray-600">
              WOMEN
            </Link>
            <Link to="/shop" className="text-gray-900 hover:text-gray-600">
              MEN
            </Link>
            <Link to="/shop" className="text-gray-900 hover:text-gray-600">
              KIDS
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Eleven
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link to="/wishlist" className="text-gray-900 hover:text-gray-600">
              <FaRegHeart size={20} />
            </Link>
            <Link to="/cart" className="text-gray-900 hover:text-gray-600">
              <MdOutlineShoppingCart size={20} />
            </Link>

            {user ? (
              <>
                <span className="text-gray-900">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-900 hover:text-gray-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-900 hover:text-gray-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-900 hover:text-gray-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-gray-900">
              <MdOutlineShoppingCart size={20} />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? "✖️" : "☰"}
            </button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="hidden lg:flex justify-center space-x-8 py-3 border-t border-gray-100">
          <Link to="/new-arrivals" className="text-gray-900 hover:text-gray-600">
            New Arrivals
          </Link>
          <Link to="/bestsellers" className="text-gray-900 hover:text-gray-600">
            Bestsellers
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-8 space-y-6">
            <Link to="/shop" className="block text-gray-900 text-lg">
              Women
            </Link>
            <Link to="/shop" className="block text-gray-900 text-lg">
              Men
            </Link>
            <Link to="/shop" className="block text-gray-900 text-lg">
              Kids
            </Link>
            <Link to="/new-arrivals" className="block text-gray-900 text-sm">
              New Arrivals
            </Link>
            <Link to="/bestsellers" className="block text-gray-900 text-sm">
              Bestsellers
            </Link>

            {user ? (
              <>
                <span className="block text-gray-900">Hello, {user.name}</span>
                <button onClick={handleLogout} className="text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-900">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
