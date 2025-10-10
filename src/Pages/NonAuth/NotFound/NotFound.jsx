import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-wide">
              404
            </h1>
            <p className="text-gray-600 text-sm uppercase tracking-widest font-light">
              Page Not Found
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Illustration/Icon */}
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg 
              className="w-16 h-16 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">
            Oops! This page got lost in style.
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to exploring our collection.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="bg-black text-white px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300 inline-block"
            >
              Back to Home
            </Link>
            <Link
              to="/shop"
              className="border border-black text-black px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300 inline-block"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/shop?category=women" className="text-gray-600 hover:text-gray-900 text-sm transition duration-300">
                Women's Collection
              </Link>
              <Link to="/shop?category=men" className="text-gray-600 hover:text-gray-900 text-sm transition duration-300">
                Men's Collection
              </Link>
              <Link to="/shop?category=new" className="text-gray-600 hover:text-gray-900 text-sm transition duration-300">
                New Arrivals
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm transition duration-300">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Optional: Featured Products Preview */}
      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="text-black hover:text-gray-700 text-sm font-light border-b border-black hover:border-gray-700 transition duration-300"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotFound;