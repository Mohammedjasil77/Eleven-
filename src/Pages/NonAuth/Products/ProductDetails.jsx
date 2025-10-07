import React, { useState, useEffect } from "react";
import { useCart } from "../../../Context/CartContext";
import { useWishlist } from "../../../Context/WishList";
import { Link } from "react-router-dom";

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
      setQuantity(1);
      setActiveImage(0);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    const result = await addToCart(product.id, selectedSize, selectedColor, quantity);
    if (result.success) {
      alert("Product added to cart successfully!");
      onClose();
    } else {
      alert(result.message);
    }
  };

  const handleWishlistToggle = async () => {
    const result = await toggleWishlist(product);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.count || 10)) {
      setQuantity(newQuantity);
    }
  };

  const isWishlisted = isInWishlist(product?.id);

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          aria-label="Close quick view"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Images */}
          <div className="relative">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.images?.[activeImage] || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-12 h-12 border-2 ${
                      activeImage === index ? "border-black" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

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
          </div>

          {/* Product Details */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Product Title */}
              <h1 className="text-2xl font-light tracking-wide">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <p className="text-xl font-light">{formatPrice(product.price)}</p>
                {product.originalPrice > product.price && (
                  <p className="text-gray-400 text-lg font-light line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
              </div>

              {/* Category */}
              <p className="text-gray-500 text-sm uppercase tracking-widest font-light">
                {product.category} • {product.gender}
              </p>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.count > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-600">
                  {product.count > 0 ? `${product.count} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm transition duration-300 ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-sm capitalize transition duration-300 ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.count}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {product.count}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.count === 0 || !selectedSize || !selectedColor}
                  className="flex-1 bg-black text-white py-3 px-6 text-sm tracking-widest uppercase font-light hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 border transition duration-300 ${
                    isWishlisted 
                      ? "border-red-500 bg-red-50 text-red-500" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    className={`w-5 h-5 transition duration-300 ${
                      isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-black fill-transparent"
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
              </div>

              {/* View Full Details */}
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  to={`/product/${product.id}`}
                  className="text-sm text-gray-600 hover:text-black transition duration-300 underline"
                  onClick={onClose}
                >
                  View full product details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;