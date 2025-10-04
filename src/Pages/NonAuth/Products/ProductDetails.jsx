import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        const foundProduct = data.products.find(p => p.id === id);
        setProduct(foundProduct);
        
        // Set default selections
        if (foundProduct) {
          setSelectedColor(foundProduct.colors?.[0] || "");
          setSelectedSize(foundProduct.sizes?.[0] || "");
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add to cart logic here
    console.log("Added to cart:", {
      product: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
    
    setIsAddingToCart(false);
    // Show success message or redirect
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    // Navigate to checkout or handle purchase
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">Loading Product</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-wide text-gray-600 mb-4">Product Not Found</h2>
          <Link
            to="/shop"
            className="inline-block border border-black text-black px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm font-light tracking-widest uppercase">
            <Link to="/" className="text-gray-500 hover:text-black transition duration-300">Home</Link>
            <span className="text-gray-300">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-black transition duration-300">Shop</Link>
            <span className="text-gray-300">/</span>
            <span className="text-black">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border-2 transition duration-300 ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
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
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {product.new && (
                  <span className="bg-red-600 text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                    New Arrival
                  </span>
                )}
                {product.featured && (
                  <span className="bg-black text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                    Featured
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="bg-green-600 text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                    Sale
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-serif font-light tracking-wide">{product.name}</h1>
              
              <div className="flex items-center gap-3">
                <p className="text-2xl font-light tracking-widest">{formatPrice(product.price)}</p>
                {product.originalPrice > product.price && (
                  <p className="text-lg text-gray-400 font-light line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
                {product.originalPrice > product.price && (
                  <p className="text-green-600 text-sm font-light">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </p>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-light tracking-widest uppercase text-gray-500">Description</h3>
              <p className="text-gray-600 font-light leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-light tracking-widest uppercase text-gray-500">
                  Color: <span className="text-black capitalize">{selectedColor}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition duration-300 ${
                        selectedColor === color ? 'border-black' : 'border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: color === 'white' ? '#ffffff' : 
                                       color === 'black' ? '#000000' :
                                       color === 'red' ? '#dc2626' :
                                       color === 'blue' ? '#2563eb' :
                                       color === 'green' ? '#059669' :
                                       color === 'brown' ? '#92400e' :
                                       color === 'beige' ? '#e7e5e4' :
                                       color === 'navy' ? '#1e3a8a' :
                                       color === 'burgundy' ? '#9f1239' :
                                       color === 'tan' ? '#d6d3d1' :
                                       color === 'nude' ? '#f5f5f4' :
                                       color === 'multicolor' ? 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' : color
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-light tracking-widest uppercase text-gray-500">
                  Size: <span className="text-black">{selectedSize}</span>
                </h3>
                <div className="grid grid-cols-4 gap-3 max-w-xs">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-light tracking-widest uppercase border transition duration-300 ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-600 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-light tracking-widest uppercase text-gray-500">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-black transition duration-300"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-light tracking-widest">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-black transition duration-300"
                    disabled={quantity >= product.count}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500 font-light">
                  {product.count} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.count === 0}
                  className={`flex-1 py-4 text-sm font-light tracking-widest uppercase border border-black transition duration-300 ${
                    product.count === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isAddingToCart
                      ? 'bg-gray-800 text-white'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isAddingToCart ? 'Adding to Cart...' : product.count === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.count === 0}
                  className={`flex-1 py-4 text-sm font-light tracking-widest uppercase border border-black transition duration-300 ${
                    product.count === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                >
                  Buy Now
                </button>
              </div>

              <button className="w-full py-4 text-sm font-light tracking-widest uppercase border border-gray-300 text-gray-600 hover:border-black hover:text-black transition duration-300 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Wishlist
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-light">Category</span>
                <span className="font-light tracking-widest uppercase">{product.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-light">SKU</span>
                <span className="font-light">{product.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-light">Delivery</span>
                <span className="font-light">Free shipping worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-serif font-light mb-8 text-center tracking-wide">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Placeholder for related products - you can fetch similar products based on category */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center">
                <div className="aspect-square bg-gray-100 mb-4"></div>
                <p className="text-sm text-gray-500 font-light">Related Product {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;