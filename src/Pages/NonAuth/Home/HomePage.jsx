import React, { useEffect, useState } from "react";
import api from "../Api/Apipage"; // your axios instance
import { Link } from "react-router-dom";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Fetch featured (random) products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data: products } = await api.get("/products");
        // Pick random 4-6 products
        const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 6);
        setFeaturedProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero bg-gray-100 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover the Latest Trends</h1>
        <p className="text-lg mb-6">Shop exclusive styles and new arrivals now</p>
        <Link to="/shop" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800">
          Shop Now
        </Link>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured py-16 px-8">
        <h2 className="text-3xl font-semibold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price}</p>
              <Link to={`/product/${product.id}`} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
