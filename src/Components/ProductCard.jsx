import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishList";
import QuickViewModal from "../Pages/NonAuth/Products/ProductDetails";

const ProductCard = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await addToCart(product.id, "M", "Default", 1);
    if (result.success) {
      alert("Product added to cart successfully!");
    } else {
      alert(result.message);
    }
  };

  const handleWishlistToggle = async (e, product) => {
    
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleWishlist(product);
    alert(result.message);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const isWishlisted = isInWishlist(product.id);

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
            onClick={(e) => handleWishlistToggle(e, product)}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 ${
              isWishlisted
                ? "bg-red-50 text-red-500"
                : "bg-white/90 backdrop-blur-sm hover:bg-white"
            }`}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
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
          {product.count === 0 && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-black text-sm tracking-widest uppercase font-light">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-end justify-between p-4">
            <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500">
              <button
                onClick={handleQuickView}
                className="bg-white text-black px-4 py-2 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300 inline-block"
              >
                Quick View
              </button>
            </div>
            <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 delay-100">
              <button
                onClick={handleAddToCart}
                disabled={product.count === 0}
                className="bg-white text-black p-2 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z"
                  />
                </svg>
              </button>
            </div>
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

          {/* Available Sizes */}
          <div className="flex justify-center gap-1 mb-4">
            <span className="text-xs text-gray-500 font-light">
              Sizes: {product.sizes?.slice(0, 3).join(", ")}
              {product.sizes?.length > 3 && "..."}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.count === 0}
            className={`w-full py-3 text-xs tracking-widest uppercase font-light border transition duration-300 ${
              product.count === 0
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-black text-white border-black hover:bg-gray-800"
            }`}
          >
            {product.count === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Quick View Mo dal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
