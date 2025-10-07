import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../../Context/WishList";
import { useCart } from "../../../Context/CartContext";
const WishlistPage = () => {
  const { 
    wishlistItems, 
    loading, 
    error, 
    removeFromWishlist, 
    moveToCart, 
    clearWishlist,
    clearError,
    getWishlistCount
  } = useWishlist();
  
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleMoveToCart = async (item) => {
    const result = await moveToCart(item, { addToCart });
    if (result.success) {
      console.log(result.message);
      alert("Item moved to cart successfully!");
    } else {
      alert(result.message);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    const result = await removeFromWishlist(itemId);
    if (result.success) {
      console.log(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleMoveAllToCart = async () => {
    const inStockItems = wishlistItems.filter(item => item.isInStock);
    if (inStockItems.length === 0) {
      alert("No items in stock to move to cart");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const item of inStockItems) {
      const result = await moveToCart(item, { addToCart });
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    if (successCount > 0) {
      alert(`Successfully moved ${successCount} items to cart${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
    } else {
      alert("Failed to move items to cart");
    }
  };

  const getTotalValue = () => {
    return wishlistItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const getInStockCount = () => {
    return wishlistItems.filter(item => item.isInStock).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">Loading Wishlist</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={clearError}
            className="border border-black text-black px-6 py-2 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-wide">
              MY WISHLIST
            </h1>
            <p className="text-gray-600 text-sm uppercase tracking-widest font-light">
              Curated Items You Love
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Wishlist Items */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 mb-8">
                <div>
                  <h2 className="text-lg font-light tracking-widest uppercase mb-2">
                    Saved Items ({wishlistItems.length})
                  </h2>
                  <p className="text-sm text-gray-500 font-light">
                    Items you've added to your wishlist
                  </p>
                </div>
                
                <div className="flex gap-3 mt-4 sm:mt-0">
                  {getInStockCount() > 0 && (
                    <button
                      onClick={handleMoveAllToCart}
                      className="border border-black text-black px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
                    >
                      Move All to Cart ({getInStockCount()})
                    </button>
                  )}
                  <button
                    onClick={clearWishlist}
                    className="border border-gray-400 text-gray-600 px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-100 transition duration-300"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4">
                      <Link to={`/product/${item.productId}`} className="block h-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                        />
                      </Link>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-100 group-hover:opacity-100 transition duration-300 hover:bg-white"
                      >
                        <svg 
                          className="w-4 h-4 fill-red-500 stroke-red-500"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* Out of Stock Overlay */}
                      {!item.isInStock && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <span className="text-black text-sm tracking-widest uppercase font-light">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Quick View */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-end justify-start">
                        <div className="p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500">
                          <Link 
                            to={`/product/${item.productId}`}
                            className="bg-white text-black px-4 py-2 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300 inline-block"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="text-center">
                      <Link to={`/product/${item.productId}`}>
                        <h3 className="text-lg font-light tracking-wide mb-2 hover:text-gray-600 transition duration-300">
                          {item.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <p className="text-gray-600 font-light tracking-widest">
                          {formatPrice(item.price)}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-gray-400 text-sm font-light line-through">
                            {formatPrice(item.originalPrice)}
                          </p>
                        )}
                      </div>
                      
                      <p className="text-gray-500 text-xs uppercase tracking-widest font-light mb-3">
                        {item.category}
                      </p>

                      {/* Size and Color Info */}
                      <div className="flex justify-center items-center gap-4 mb-3 text-xs text-gray-500">
                        <span>Size: {item.size || "M"}</span>
                        <span>Color: {item.color || "Default"}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={!item.isInStock}
                        className={`w-full py-3 text-xs tracking-widest uppercase font-light border transition duration-300 mb-2 ${
                          !item.isInStock
                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                            : 'bg-black text-white border-black hover:bg-gray-800'
                        }`}
                      >
                        {!item.isInStock ? 'Out of Stock' : 'Move to Cart'}
                      </button>

                      {/* Added Date */}
                      {item.addedAt && (
                        <p className="text-xs text-gray-400 font-light">
                          Added {new Date(item.addedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Wishlist Summary */}
                <div className="border border-gray-200 p-6">
                  <h3 className="text-lg font-light tracking-widest uppercase mb-4">
                    Wishlist Summary
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-light text-gray-600">Total Items</span>
                      <span className="font-light">{wishlistItems.length}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-light text-gray-600">Available</span>
                      <span className="font-light text-green-600">{getInStockCount()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-light text-gray-600">Out of Stock</span>
                      <span className="font-light text-red-600">
                        {wishlistItems.length - getInStockCount()}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between text-base">
                        <span className="font-light">Total Value</span>
                        <span className="font-light tracking-widest">
                          {formatPrice(getTotalValue())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <Link
                      to="/shop"
                      className="w-full bg-black text-white py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300 block text-center"
                    >
                      Continue Shopping
                    </Link>
                    
                    {getInStockCount() > 0 && (
                      <button
                        onClick={handleMoveAllToCart}
                        className="w-full border border-black text-black py-3 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
                      >
                        Move All to Cart
                      </button>
                    )}
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="border border-gray-200 p-6">
                  <h3 className="text-lg font-light tracking-widest uppercase mb-4">
                    Wishlist Benefits
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save items you love</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Get notified when items go on sale</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Quickly move items to cart</span>
                    </li>
                  </ul>
                </div>               
              </div>
            </div>
          </div>
        ) : (
          /* Empty Wishlist State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-2xl font-light tracking-wide text-gray-600 mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-500 font-light mb-8">
                Start curating your collection. Save items you love for later.
              </p>
              <div className="space-x-4">
                <Link
                  to="/shop"
                  className="inline-block bg-black text-white px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
                >
                  Explore Collection
                </Link>
                <Link
                  to="/new-arrivals"
                  className="inline-block border border-black text-black px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default WishlistPage;