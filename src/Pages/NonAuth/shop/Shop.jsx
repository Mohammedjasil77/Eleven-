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
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const genderFilter = searchParams.get("gender");

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

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    let filtered = [...products];

    // ✅ Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.gender.toLowerCase().includes(query)
      );
    }

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
  }, [selectedCategory, sortBy, products, genderFilter, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

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

      {/* Search Bar */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products by name, description, category..."
                className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-none text-sm font-light tracking-wide focus:outline-none focus:border-black transition duration-300 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search Results Info */}
            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="text-sm font-light text-gray-600">
                  {filteredProducts.length > 0 ? (
                    <>
                      Found <span className="font-medium">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''} for "<span className="font-medium">{searchQuery}</span>"
                    </>
                  ) : (
                    <>
                      No products found for "<span className="font-medium">{searchQuery}</span>"
                    </>
                  )}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-2 text-xs font-light tracking-widest uppercase text-gray-500 hover:text-black transition duration-300 border-b border-transparent hover:border-black"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
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
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4 lg:mb-0">
            <p className="text-sm font-light tracking-widest uppercase text-gray-500">
              {filteredProducts.length} PRODUCTS
            </p>
            
            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all" || genderFilter) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-light">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light bg-gray-100 text-gray-700">
                      Search: "{searchQuery}"
                      <button
                        onClick={clearSearch}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light bg-gray-100 text-gray-700">
                      Category: {categories.find(c => c.id === selectedCategory)?.name}
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {genderFilter && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light bg-gray-100 text-gray-700">
                      Gender: {genderFilter}
                    </span>
                  )}
                </div>
              </div>
            )}
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
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-light tracking-wide text-gray-600 mb-4">
                {searchQuery ? "No products found matching your search" : "No products found in this category"}
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="border border-black text-black px-6 py-2 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
                >
                  View All Collections
                </button>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="border border-gray-300 text-gray-600 px-6 py-2 text-sm font-light tracking-widest uppercase hover:border-black hover:text-black transition duration-300"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopPage;