import React from "react";
import { Link } from "react-router-dom";

// Sample featured products (replace with API later)
const featuredProducts = [
  {
    id: 1,
    name: "Gucci Ace Embroidered",
    price: 850,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    category: "SNEAKERS"
  },
  {
    id: 2,
    name: "Rhython Platform",
    price: 1200,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    category: "PLATFORMS"
  },
  {
    id: 3,
    name: "Princetown Slipper",
    price: 750,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
    category: "SLIPPERS"
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Screen Video/Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img
            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Shoes"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
        
        <div className="relative text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 tracking-tight leading-tight">
            ELEVATE YOUR
            <br />
            <span className="italic">FOOTWEAR</span>
          </h1>
          <p className="text-lg md:text-xl font-light tracking-widest mb-8 uppercase">
            Discover the art of luxury footwear
          </p>
          <div className="space-x-4">
            <Link
              to="/shop"
              className="inline-block bg-white text-black px-8 py-3 font-light tracking-widest text-sm uppercase hover:bg-gray-100 transition duration-300"
            >
              Shop Collection
            </Link>
            <Link
              to="/new-arrivals"
              className="inline-block border border-white text-white px-8 py-3 font-light tracking-widest text-sm uppercase hover:bg-white hover:text-black transition duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-16 bg-white/60">
            <div className="w-px h-8 bg-white animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-8 tracking-wide">
            Crafted for the Extraordinary
          </h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Each pair embodies our commitment to exceptional craftsmanship, 
            innovative design, and timeless elegance. Discover footwear that 
            transcends trends and becomes part of your legacy.
          </p>
        </div>
      </section>

      {/* Featured Products - Minimal Grid */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-light mb-4 tracking-wide">
              Featured Collection
            </h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-light">
              Curated Excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="group relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                
                <div className="absolute bottom-8 left-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500">
                  <span className="text-xs tracking-widest uppercase font-light block mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-light mb-2">{product.name}</h3>
                  <p className="text-sm font-light">${product.price}</p>
                </div>
                
                <div className="absolute top-6 right-6">
                  <span className="bg-white text-black px-3 py-1 text-xs tracking-widest uppercase font-light">
                    New
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Width Banner */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide">
            THE ART OF
            <br />
            <span className="italic">MOVEMENT</span>
          </h2>
          <p className="text-gray-600 text-lg font-light mb-8 max-w-2xl mx-auto tracking-wide">
            Where Italian craftsmanship meets contemporary design. 
            Experience footwear that celebrates individuality and sophistication.
          </p>
          <Link
            to="/about"
            className="inline-block border border-black text-black px-8 py-3 font-light tracking-widest text-sm uppercase hover:bg-black hover:text-white transition duration-300"
          >
            Discover Our Story
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-2xl font-serif font-light mb-4 tracking-wide">
            STAY CONNECTED
          </h2>
          <p className="text-gray-600 font-light mb-8 tracking-wide">
            Be the first to discover new collections and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm font-light tracking-wide focus:outline-none focus:border-black transition duration-300"
            />
            <button className="bg-black text-white px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;