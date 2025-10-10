// CategoryProducts.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../../Api/Apipage";
import ProductCard from "../../../Components/ProductCard";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    gender: "",
    priceRange: "",
    sortBy: "name"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products
        const { data: productsData } = await api.get("/products");
        // Fetch categories to get category name
        const { data: categoriesData } = await api.get("/categories");
        
        const currentCategory = categoriesData.find(cat => cat.id === categoryId);
        setCategory(currentCategory);
        
        // Filter products by category
        const categoryProducts = productsData.filter(
          product => product.category === categoryId && product.isActive
        );
        
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  useEffect(() => {
    let filtered = [...products];

    // Apply gender filter
    if (filters.gender) {
      filtered = filtered.filter(product => product.gender === filters.gender);
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (max) {
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
      } else {
        filtered = filtered.filter(product => product.price >= min);
      }
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      gender: "",
      priceRange: "",
      sortBy: "name"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex space-x-2 text-sm font-light">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-gray-700">Shop</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 capitalize">{category?.name || categoryId}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-light mb-4 tracking-wide capitalize">
            {category?.name || categoryId}
          </h1>
          <p className="text-gray-600 font-light">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Gender Filter */}
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="px-4 py-2 border border-gray-300 text-sm font-light focus:outline-none focus:border-black"
            >
              <option value="">All Genders</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>

            {/* Price Range Filter */}
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
              className="px-4 py-2 border border-gray-300 text-sm font-light focus:outline-none focus:border-black"
            >
              <option value="">All Prices</option>
              <option value="0-25000">Under ₹25,000</option>
              <option value="25000-50000">₹25,000 - ₹50,000</option>
              <option value="50000-75000">₹50,000 - ₹75,000</option>
              <option value="75000-100000">₹75,000 - ₹1,00,000</option>
              <option value="100000-9999999">Over ₹1,00,000</option>
            </select>

            {/* Clear Filters */}
            {(filters.gender || filters.priceRange) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-black font-light underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-light">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="px-4 py-2 border border-gray-300 text-sm font-light focus:outline-none focus:border-black"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-light text-gray-600 mb-4">No products found</h3>
            <p className="text-gray-500 font-light mb-6">
              Try adjusting your filters or browse other categories
            </p>
            <Link
              to="/shop"
              className="inline-block border border-black text-black px-6 py-3 text-sm uppercase tracking-widest font-light hover:bg-black hover:text-white transition duration-300"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;