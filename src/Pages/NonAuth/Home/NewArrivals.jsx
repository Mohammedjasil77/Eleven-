import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch new arrivals
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        // Filter products that are marked as new
        const newArrivals = data.products.filter(product => product.new);
        setNewProducts(newArrivals);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">Loading New Arrivals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
            alt="New Arrivals"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6 tracking-tight">
            NEW ARRIVALS
          </h1>
          <p className="text-lg font-light tracking-widest uppercase mb-8">
            Discover the latest additions to our collection
          </p>
          <div className="w-16 h-px bg-white mx-auto"></div>
        </div>
      </section>

      {/* Introduction Text */}
      <section className="py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif font-light mb-6 tracking-wide">
            Fresh Perspectives in Luxury Footwear
          </h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Experience the latest innovations in design and craftsmanship. 
            Each new arrival embodies our commitment to exceptional quality 
            and contemporary elegance.
          </p>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-light mb-4 tracking-wide">
            Latest Collection
          </h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-light">
            {newProducts.length} New Pieces
          </p>
        </div>

        {/* Products Grid */}
        {newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {newProducts.map(product => (
              <div key={product.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                  />
                  
                  {/* New Arrival Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                      Just In
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-black text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice > product.price && (
                    <div className="absolute top-16 left-4">
                      <span className="bg-white text-black px-3 py-1 text-xs tracking-widest uppercase font-light">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Out of Stock Overlay */}
                  {product.count === 0 && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <span className="text-black text-sm tracking-widest uppercase font-light">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-end justify-between p-6">
                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500">
                      <button className="bg-white text-black px-6 py-3 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300">
                        Quick View
                      </button>
                    </div>
                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 delay-100">
                      <button className="bg-white text-black p-3 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-center">
                  <h3 className="text-lg font-light tracking-wide mb-2">{product.name}</h3>
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
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition duration-300">
                    <button 
                      disabled={product.count === 0}
                      className={`text-xs tracking-widest uppercase font-light border-b border-black hover:opacity-70 transition duration-300 ${
                        product.count === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {product.count === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
              </svg>
              <h3 className="text-xl font-light tracking-wide text-gray-600 mb-4">
                No New Arrivals
              </h3>
              <p className="text-gray-500 font-light mb-6">
                Check back soon for our latest collections and exclusive releases.
              </p>
              <Link
                to="/shop"
                className="inline-block border border-black text-black px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
              >
                Browse All Collections
              </Link>
            </div>
          </div>
        )}

        {/* View All Button */}
        {newProducts.length > 0 && (
          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="inline-block border border-black text-black px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
            >
              View Full Collection
            </Link>
          </div>
        )}
      </section>

      {/* Exclusive Section */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-light mb-6 tracking-wide">
            BE THE FIRST TO KNOW
          </h2>
          <p className="text-gray-600 text-lg font-light mb-8 max-w-2xl mx-auto tracking-wide">
            Sign up for exclusive early access to new collections, 
            private sales, and special events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm font-light tracking-widest focus:outline-none focus:border-black transition duration-300 text-center sm:text-left bg-white"
            />
            <button className="bg-black text-white px-8 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300 whitespace-nowrap">
              Get Early Access
            </button>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif font-light mb-4 tracking-wide">
            FOLLOW OUR STORY
          </h2>
          <p className="text-gray-600 font-light mb-8 tracking-wide">
            Discover more behind the scenes on Instagram
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square bg-gray-100 relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;