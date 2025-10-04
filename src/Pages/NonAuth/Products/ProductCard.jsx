import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden mb-4">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
          />
        </Link>
        
        {/* Product Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.new && (
            <span className="bg-white text-black px-3 py-1 text-xs tracking-widest uppercase font-light block">
              New
            </span>
          )}
          {product.featured && (
            <span className="bg-black text-white px-3 py-1 text-xs tracking-widest uppercase font-light block">
              Featured
            </span>
          )}
          {product.originalPrice > product.price && (
            <span className="bg-red-600 text-white px-3 py-1 text-xs tracking-widest uppercase font-light block">
              Sale
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.count === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-black text-sm tracking-widest uppercase font-light">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-end justify-start">
          <div className="p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500">
            <button className="bg-white text-black px-6 py-3 text-xs tracking-widest uppercase font-light hover:bg-gray-100 transition duration-300">
              Quick View
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
  );
};

export default ProductCard;