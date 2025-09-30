import React from "react";
import { Link } from "react-router-dom";

// Sample featured products (replace with API later)
const featuredProducts = [
  {
    id: 1,
    name: "Air Max 270",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1618354693238-f8f82aa69d7f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Jordan Retro 1",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1593032465172-ec7f134b3f6c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Yeezy Boost 350",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1618354693349-d4e5e62f8b18?auto=format&fit=crop&w=400&q=80",
  },
];

const HomePage = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-black text-white h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Step Up Your Shoe Game
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Discover the latest and greatest sneakers for every style.
          </p>
          <Link
            to="/shop"
            className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-2">${product.price}</p>
                <Link
                  to={`/shop/${product.id}`}
                  className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
