import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [currentUserId] = useState("1"); // In real app, get from auth context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setFilteredProducts(data.products || []);
        
        // Fetch user wishlist
        const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`);
        const userData = await userResponse.json();
        setWishlist(userData.wishlist || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "new":
        filtered = [...filtered].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case "featured":
        filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const addToWishlist = async (productId) => {
    try {
      const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`);
      const userData = await userResponse.json();
      
      const isInWishlist = userData.wishlist?.some(item => item.productId === productId);
      
      let updatedWishlist;
      if (isInWishlist) {
        // Remove from wishlist
        updatedWishlist = userData.wishlist.filter(item => item.productId !== productId);
      } else {
        // Add to wishlist
        const newWishlistItem = {
          id: `wish_${Date.now()}`,
          productId: productId,
          addedAt: new Date().toISOString()
        };
        updatedWishlist = [...(userData.wishlist || []), newWishlistItem];
      }
      
      await fetch(`http://localhost:3001/users/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishlist: updatedWishlist
        })
      });
      
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`);
      const userData = await userResponse.json();
      
      const product = products.find(p => p.id === productId);
      if (!product) return;

      // Check if product is already in cart
      const existingCartItem = userData.cart?.find(item => item.productId === productId);
      
      let updatedCart;
      if (existingCartItem) {
        // Increase quantity if already in cart
        updatedCart = userData.cart.map(item =>
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart with default size and color
        const newCartItem = {
          id: `cart_${Date.now()}`,
          productId: productId,
          quantity: 1,
          size: product.sizes[0], // Use first available size
          color: product.colors[0], // Use first available color
          addedAt: new Date().toISOString()
        };
        updatedCart = [...(userData.cart || []), newCartItem];
      }
      
      await fetch(`http://localhost:3001/users/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        })
      });
      
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">Loading Collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-wide">
              THE COLLECTION
            </h1>
            <p className="text-gray-600 text-sm uppercase tracking-widest font-light">
              Curated Luxury Footwear
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto space-x-8 py-6 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 text-sm font-light tracking-widest uppercase transition duration-300 whitespace-nowrap pb-1 border-b-2 ${
                selectedCategory === "all"
                  ? "text-black border-black"
                  : "text-gray-500 hover:text-black border-transparent"
              }`}
            >
              All Collections
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 text-sm font-light tracking-widest uppercase transition duration-300 whitespace-nowrap pb-1 border-b-2 ${
                  selectedCategory === category.id
                    ? "text-black border-black"
                    : "text-gray-500 hover:text-black border-transparent"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Sort Bar */}
      <section className="border-b border-gray-200 sticky top-20 bg-white z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-6">
            <div className="mb-4 lg:mb-0">
              <p className="text-sm font-light tracking-widest uppercase text-gray-500">
                {filteredProducts.length} PRODUCTS
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border border-gray-300 px-4 py-2 text-sm font-light tracking-widest uppercase focus:outline-none focus:border-black cursor-pointer pr-8"
                >
                  <option value="featured">FEATURED</option>
                  <option value="new">NEW ARRIVALS</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                  <option value="price-high">PRICE: HIGH TO LOW</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden text-sm font-light tracking-widest uppercase flex items-center space-x-2 border border-gray-300 px-4 py-2"
              >
                <span>FILTER</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="space-y-4">
                <h3 className="text-sm font-light tracking-widest uppercase text-gray-500">CATEGORIES</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setIsFilterOpen(false);
                    }}
                    className={`text-left text-sm font-light tracking-wide py-2 px-3 transition duration-300 ${
                      selectedCategory === "all"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    All Collections
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-sm font-light tracking-wide py-2 px-3 transition duration-300 ${
                        selectedCategory === category.id
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Link to={`/product/${product.id}`} className="block h-full">
                    <img
                      src={product.images[0]}
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
                    onClick={() => addToWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-white"
                  >
                    <svg 
                      className={`w-4 h-4 transition duration-300 ${
                        isInWishlist(product.id) ? 'fill-red-500 stroke-red-500' : 'stroke-black fill-transparent'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
                      <Link 
                        to={`/product/${product.id}`}
                        className="bg-white text-black px-4 py-2 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300 inline-block"
                      >
                        Quick View
                      </Link>
                    </div>
                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 delay-100">
                      <button 
                        onClick={() => addToCart(product.id)}
                        disabled={product.count === 0}
                        className="bg-white text-black p-2 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
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

                  {/* Available Sizes - Simplified */}
                  <div className="flex justify-center gap-1 mb-4">
                    <span className="text-xs text-gray-500 font-light">
                      Sizes: {product.sizes.slice(0, 3).join(', ')}
                      {product.sizes.length > 3 && '...'}
                    </span>
                  </div>

                  {/* Add to Cart Button - Always Visible */}
                  <button 
                    onClick={() => addToCart(product.id)}
                    disabled={product.count === 0}
                    className={`w-full py-3 text-xs tracking-widest uppercase font-light border transition duration-300 ${
                      product.count === 0 
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                        : 'bg-black text-white border-black hover:bg-gray-800'
                    }`}
                  >
                    {product.count === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-light tracking-wide text-gray-600 mb-4">
              No products found in this category
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="border border-black text-black px-6 py-2 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
            >
              View All Collections
            </button>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="text-center mt-16">
            <button className="border border-black text-black px-8 py-3 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300">
              Load More
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-gray-200 py-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-2xl font-serif font-light mb-4 tracking-wide">
            BE THE FIRST TO KNOW
          </h2>
          <p className="text-gray-600 font-light mb-8 tracking-wide">
            Sign up for updates on new collections, exclusive offers and private events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm font-light tracking-widest focus:outline-none focus:border-black transition duration-300 text-center sm:text-left"
            />
            <button className="bg-black text-white px-8 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;