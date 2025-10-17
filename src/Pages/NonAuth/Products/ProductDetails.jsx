import React, { useState, useEffect } from "react";
import { useCart } from "../../../Context/CartContext";
import { useWishlist } from "../../../Context/WishList";
import { useNavigate } from "react-router-dom";

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart, cartItems, isInCart } = useCart(); // Use the isInCart from context
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(product?.id, selectedSize, selectedColor);

  // FIXED: Use the isInCart function from CartContext
  const productInCart = isInCart(product?.id, selectedSize, selectedColor);

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

  // Function to handle view cart
  const handleViewCart = () => {
    navigate("/cart");
    onClose();
  };

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    // If product is not in cart, add it first
    if (!productInCart) {
      const result = await addToCart(product.id, selectedSize, selectedColor, quantity);
      if (!result.success) {
        alert(result.message);
        return;
      }
    }

    // Then navigate to buy-now page
    navigate("/buy-now", { 
      state: { 
        product: {
          ...product,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
          quantity: quantity
        }
      } 
    });
    onClose();
  };

  const handleWishlistToggle = async () => {
    console.log('Product ID:', product?.id);
    console.log('Selected Size:', selectedSize);
    console.log('Selected Color:', selectedColor);
    console.log('Current wishlist status:', isWishlisted);
    
    try {
      const result = await toggleWishlist(product, selectedSize, selectedColor);
      
      console.log('Wishlist operation result:', result);
      
      if (result.success) {
        if (result.action === "added") {
          alert("Product added to wishlist!");
        } else if (result.action === "removed") {
          alert("Product removed from wishlist!");
        }
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.count || 10)) {
      setQuantity(newQuantity);
    }
  };

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

        {/* Debug Info - Remove in production */}
        <div className="absolute top-4 left-4 bg-yellow-100 p-2 rounded text-xs">
          Wishlist: {isWishlisted ? 'IN' : 'OUT'} | Cart: {productInCart ? 'IN' : 'OUT'} | Size: {selectedSize} | Color: {selectedColor}
        </div>

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
              <div className="space-y-3 pt-4">
                {/* Buy Now & Cart Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBuyNow}
                    disabled={product.count === 0 || !selectedSize || !selectedColor}
                    className="flex-1 bg-red-600 text-white py-3 px-6 text-sm tracking-widest uppercase font-light hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                  
                  {/* Conditional Cart Button */}
                  {!productInCart ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={product.count === 0 || !selectedSize || !selectedColor}
                      className="flex-1 bg-black text-white py-3 px-6 text-sm tracking-widest uppercase font-light hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      onClick={handleViewCart}
                      className="flex-1 bg-green-600 text-white py-3 px-6 text-sm tracking-widest uppercase font-light hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      View in Cart
                    </button>
                  )}
                </div>

                {/* Wishlist Button - Full Width */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={product.count === 0}
                  className={`w-full py-3 px-6 border text-sm tracking-widest uppercase font-light transition duration-300 flex items-center justify-center gap-2 ${
                    isWishlisted 
                      ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100" 
                      : "border-gray-300 text-gray-700 hover:border-black hover:bg-gray-50"
                  } ${product.count === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <svg
                    className={`w-4 h-4 transition duration-300 ${
                      isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-current fill-transparent"
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
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;