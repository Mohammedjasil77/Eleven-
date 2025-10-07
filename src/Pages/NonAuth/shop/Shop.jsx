import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../../Components/ProductCard";
import api from "../../../../Api/Apipage";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // ✅ to read URL query params
  const searchParams = new URLSearchParams(location.search);
  const genderFilter = searchParams.get("gender"); // e.g. men, women, kids

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        setProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        setFilteredProducts(productsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        try {
          const response = await fetch("/db.json");
          const data = await response.json();
          setProducts(data.products || []);
          setCategories(data.categories || []);
          setFilteredProducts(data.products || []);
        } catch (fallbackError) {
          console.error("Fallback fetch failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // ✅ Filter by gender from Navbar
    if (genderFilter) {
      filtered = filtered.filter(
        (product) =>
          product.gender?.toLowerCase() === genderFilter.toLowerCase()
      );
    }

    // ✅ Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // ✅ Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "new":
        filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products, genderFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">
            Loading Collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-wide">
            {genderFilter
              ? `${genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}'s Collection`
              : "THE COLLECTION"}
          </h1>
          <p className="text-gray-600 text-sm uppercase tracking-widest font-light">
            Curated Luxury Footwear
          </p>
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
            {categories.map((category) => (
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

      {/* Filters & Sort */}
      <section className="border-b border-gray-200 sticky top-20 bg-white z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-start lg:items-center py-6">
          <p className="text-sm font-light tracking-widest uppercase text-gray-500 mb-4 lg:mb-0">
            {filteredProducts.length} PRODUCTS
          </p>
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
      </section>
    </div>
  );
};

export default ShopPage;
