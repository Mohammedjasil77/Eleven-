import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishList";
import QuickViewModal from "../Pages/NonAuth/Products/ProductDetails";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleProductAction = async (e, actionType) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if size is required but not selected
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.warning("📏 Please select a size first!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setShowSizeModal(true);
      return;
    }

    const sizeToUse = selectedSize || "M";

    if (actionType === "cart") {
      const result = await addToCart(product.id, sizeToUse, "Default", 1);
      if (result.success) {
        toast.success("🛒 Product added to cart successfully!");
      } else {
        toast.error(`❌ ${result.message || "Failed to add product to cart"}`);
      }
    } else if (actionType === "buy") {
      navigate("/buy-now", {
        state: {
          product: {
            ...product,
            selectedSize: sizeToUse,
          },
        },
      });
      toast.info("🚀 Proceeding to checkout...");
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleWishlist(product);
    if (result.success) {
      if (result.action === "added") {
        toast.success("💖 Added to wishlist!");
      } else {
        toast.info("🗑️ Removed from wishlist");
      }
    } else {
      toast.error(`❌ ${result.message || "Failed to update wishlist"}`);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setShowSizeModal(false);
    toast.success(`✅ Size ${size} selected!`);
  };

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.count === 0;

  return (
    <>
      <div className="group">
        <div className="relative aspect-[3/4] overflow-hidden mb-4">
          <Link to={`/product/${product.id}`} className="block h-full">
            <img
              src={product.images?.[0] || "/placeholder-image.jpg"}
              alt={product.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
            />
          </Link>

          {/* Product Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {product.new && (
              <span className="bg-white text-black px-3 py-1 text-xs tracking-widest uppercase font-light">
                New
              </span>
            )}
            {product.featured && (
              <span className="bg-black text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                Featured
              </span>
            )}
            {product.originalPrice > product.price && (
              <span className="bg-red-600 text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 ${
              isWishlisted
                ? "bg-red-50 text-red-500"
                : "bg-white/90 backdrop-blur-sm hover:bg-white"
            }`}
          >
            <svg
              className={`w-4 h-4 transition duration-300 ${
                isWishlisted
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-black fill-transparent"
              }`}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-black text-sm tracking-widest uppercase font-light">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick View Button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-end justify-start p-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 bg-white text-black px-4 py-2 text-xs tracking-widest uppercase font-light hover:bg-gray-100"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="text-center">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-light tracking-wide mb-2 hover:text-gray-600 transition duration-300">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-gray-600 font-light tracking-widest">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice > product.price && (
              <p className="text-gray-400 text-sm font-light line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>

          <p className="text-gray-500 text-xs uppercase tracking-widest font-light mb-3">
            {product.category}
          </p>

          {/* Selected Size Display */}
          {selectedSize && (
            <div className="mb-2">
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                Size: {selectedSize}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-3">
            {/* Size Button */}
            <button
              onClick={() => setShowSizeModal(true)}
              disabled={isOutOfStock}
              className={`flex-1 py-3 text-xs tracking-widest uppercase font-light border transition duration-300 ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  : selectedSize
                  ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                  : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
              }`}
            >
              {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
            </button>

            {/* Buy Now Button */}
            <button
              onClick={(e) => handleProductAction(e, "buy")}
              disabled={isOutOfStock}
              className="flex-1 py-3 text-xs tracking-widest uppercase font-light border bg-red-600 text-white border-red-600 hover:bg-red-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition duration-300"
            >
              Buy Now
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => handleProductAction(e, "cart")}
            disabled={isOutOfStock}
            className={`w-full py-3 text-xs tracking-widest uppercase font-light border transition duration-300 ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                : product.sizes?.length > 0 && !selectedSize
                ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                : "bg-black text-white border-black hover:bg-gray-800"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : product.sizes?.length > 0 && !selectedSize
              ? "Add to Cat"
              : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowSizeModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-light">Select Size</h3>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-gray-500 hover:text-black"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`py-3 border text-sm transition duration-300 ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full py-3 bg-black text-white text-sm font-light hover:bg-gray-800 transition duration-300"
            >
              Confirm Size
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard;