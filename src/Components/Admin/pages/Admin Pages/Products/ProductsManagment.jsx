// src/Components/Admin/pages/Admin Pages/Products/ProductsManagment.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../../Api/Apipage";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const getStockStatus = (product) => {
    const count = product.count || product.stock || 0;
    if (count === 0)
      return { text: "OUT OF STOCK", color: "bg-red-100 text-red-800" };
    if (count < 5)
      return { text: "LOW STOCK", color: "bg-orange-100 text-orange-800" };
    if (count < 10)
      return { text: "LIMITED", color: "bg-yellow-100 text-yellow-800" };
    return { text: "IN STOCK", color: "bg-green-100 text-green-800" };
  };

  // Get unique categories for filter
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Search filter
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.gender?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      
      // Stock filter
      const stock = product.count || product.stock || 0;
      const matchesStock = 
        stockFilter === "all" ? true :
        stockFilter === "in-stock" ? stock > 0 :
        stockFilter === "out-of-stock" ? stock === 0 :
        stockFilter === "low-stock" ? stock > 0 && stock < 10 : true;
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      // Sort products
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "stock-low":
          return (a.count || a.stock || 0) - (b.count || b.stock || 0);
        case "stock-high":
          return (b.count || b.stock || 0) - (a.count || a.stock || 0);
        case "newest":
          return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
        case "oldest":
          return new Date(a.createdAt || a.created_at || 0) - new Date(b.createdAt || b.created_at || 0);
        default:
          return 0;
      }
    });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage your store products and inventory
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add New Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Products</div>
          <div className="text-2xl font-bold text-gray-900">
            {products.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {products.filter((p) => (p.count || p.stock || 0) === 0).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Low Stock</div>
          <div className="text-2xl font-bold text-orange-600">
            {
              products.filter(
                (p) =>
                  (p.count || p.stock || 0) < 10 &&
                  (p.count || p.stock || 0) > 0
              ).length
            }
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Categories</div>
          <div className="text-2xl font-bold text-gray-900">
            {new Set(products.map((p) => p.category)).size}
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by name, category, or gender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== "all").map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="low-stock">Low Stock</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="stock-high">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && (
              <span className="ml-2 text-blue-600">
                for "{searchTerm}"
              </span>
            )}
          </div>
          
          {(searchTerm || categoryFilter !== "all" || stockFilter !== "all" || sortBy !== "newest") && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <span className="mr-1">🔄</span>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const hasImage =
            product.image || product.imageUrl || product.images?.[0];

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-300"
            >
              {/* Product Image */}
              <div className="relative w-full pt-[100%] bg-gray-100">
                {hasImage ? (
                  <img
                    src={
                      product.image || product.imageUrl || product.images?.[0]
                    }
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <div className="text-gray-400 text-4xl mb-2">📦</div>
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 capitalize">
                  {product.category} • {product.gender}
                </p>
                <p className="text-lg font-bold text-gray-900 mb-3">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(product.price)}
                </p>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}
                  >
                    {stockStatus.text} • {product.count || product.stock || 0}
                  </span>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">
            {searchTerm || categoryFilter !== "all" || stockFilter !== "all" ? "🔍" : "📦"}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || categoryFilter !== "all" || stockFilter !== "all" 
              ? "No products found" 
              : "No products available"
            }
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || categoryFilter !== "all" || stockFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Get started by adding your first product"
            }
          </p>
          {(searchTerm || categoryFilter !== "all" || stockFilter !== "all") ? (
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/products/add")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;