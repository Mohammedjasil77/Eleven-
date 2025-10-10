// src/Pages/Admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../Api/Apipage";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    blockedUsers: 0,
    lowStockProducts: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersResponse, productsResponse] = await Promise.all([
        api.get("/users"),
        api.get("/products")
      ]);

      const users = usersResponse.data || [];
      const products = productsResponse.data || [];

      // Calculate stats based on your actual data structure
      const totalUsers = users.length;
      const blockedUsers = users.filter(user => user.isBlock).length;
      const totalProducts = products.length;
      const lowStockProducts = products.filter(product => product.count < 10).length;
      
      // Calculate revenue from products (this would normally come from orders)
      // For now, we'll calculate potential revenue from product prices
      const totalInventoryValue = products.reduce((sum, product) => {
        return sum + (product.price * product.count);
      }, 0);

      setStats({
        totalUsers,
        totalProducts,
        totalOrders: 0, // You don't have orders in your data yet
        revenue: totalInventoryValue,
        blockedUsers,
        lowStockProducts
      });

      // Get recent users (last 5)
      const sortedUsers = users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      // Get recent products (last 5)
      const sortedProducts = products
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentProducts(sortedProducts);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to calculated data from your JSON
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    // Calculate from your provided JSON data
    const users = [
      // Your users array from JSON
      { id: "1", name: "Mohammed Jasil", email: "jasil@example.com", role: "user", isBlock: false, created_at: "2025-09-28T10:00:00Z" },
      { id: "2", name: "Admin User", email: "admin@shoestore.com", role: "admin", isBlock: false, created_at: "2025-09-27T11:30:00Z" },
      { id: "3", name: "Blocked User", email: "blocked@example.com", role: "user", isBlock: true, created_at: "2025-09-26T15:00:00Z" },
      // ... other users
    ];

    const products = [
      // Your products array from JSON
      { id: "1", name: "GG Marmont Matelassé Sneaker", price: 98000, count: 15, created_at: "2025-09-25T09:00:00Z" },
      { id: "2", name: "Rhython Platform Leather", price: 120000, count: 8, created_at: "2025-09-25T09:15:00Z" },
      // ... other products
    ];

    const totalUsers = users.length;
    const blockedUsers = users.filter(user => user.isBlock).length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(product => product.count < 10).length;
    const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.count), 0);

    setStats({
      totalUsers,
      totalProducts,
      totalOrders: 0,
      revenue: totalInventoryValue,
      blockedUsers,
      lowStockProducts
    });

    setRecentUsers(users.slice(0, 5));
    setRecentProducts(products.slice(0, 5));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStockStatus = (count) => {
    if (count === 0) return { text: 'OUT OF STOCK', color: 'text-red-600 bg-red-50' };
    if (count < 5) return { text: 'LOW STOCK', color: 'text-orange-600 bg-orange-50' };
    if (count < 10) return { text: 'LIMITED', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'IN STOCK', color: 'text-green-600 bg-green-50' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">
            Loading Dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-serif font-light mb-2 tracking-wide">
            ADMIN DASHBOARD
          </h1>
          <p className="text-gray-600 text-sm uppercase tracking-widest font-light">
            Store Overview & Analytics
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Total Users Card */}
            <div 
              onClick={() => navigate('/admin/users')}
              className="border border-gray-200 p-8 text-center cursor-pointer hover:border-black transition duration-300 group"
            >
              <div className="text-3xl font-serif font-light text-gray-400 group-hover:text-black transition duration-300 mb-4">
                👥
              </div>
              <h3 className="text-4xl font-light text-gray-900 mb-2">
                {stats.totalUsers}
              </h3>
              <p className="text-sm font-light tracking-widest uppercase text-gray-500">
                Total Users
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-light text-gray-400">
                  {stats.blockedUsers} blocked users
                </p>
              </div>
            </div>

            {/* Total Products Card */}
            <div 
              onClick={() => navigate('/admin/products')}
              className="border border-gray-200 p-8 text-center cursor-pointer hover:border-black transition duration-300 group"
            >
              <div className="text-3xl font-serif font-light text-gray-400 group-hover:text-black transition duration-300 mb-4">
                📦
              </div>
              <h3 className="text-4xl font-light text-gray-900 mb-2">
                {stats.totalProducts}
              </h3>
              <p className="text-sm font-light tracking-widest uppercase text-gray-500">
                Total Products
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-light text-red-500">
                  {stats.lowStockProducts} low stock
                </p>
              </div>
            </div>

            {/* Inventory Value Card */}
            <div className="border border-gray-200 p-8 text-center group">
              <div className="text-3xl font-serif font-light text-gray-400 group-hover:text-black transition duration-300 mb-4">
                💰
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-2">
                {formatPrice(stats.revenue)}
              </h3>
              <p className="text-sm font-light tracking-widest uppercase text-gray-500">
                Inventory Value
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-light text-gray-400">
                  Total stock value
                </p>
              </div>
            </div>

            {/* Orders Card */}
            <div className="border border-gray-200 p-8 text-center group">
              <div className="text-3xl font-serif font-light text-gray-400 group-hover:text-black transition duration-300 mb-4">
                📋
              </div>
              <h3 className="text-4xl font-light text-gray-900 mb-2">
                {stats.totalOrders}
              </h3>
              <p className="text-sm font-light tracking-widest uppercase text-gray-500">
                Total Orders
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-light text-gray-400">
                  Order management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Recent Users */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-light tracking-widest uppercase">
                  RECENT USERS
                </h2>
                <span className="text-xs font-light text-gray-500 bg-gray-100 px-2 py-1">
                  {recentUsers.length} NEW
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition duration-300 cursor-pointer"
                    onClick={() => navigate('/admin/users')}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-light text-gray-900">{user.name}</p>
                        <p className="text-sm font-light text-gray-500">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-light tracking-wide ${
                        user.isBlock 
                          ? 'text-red-600 bg-red-50' 
                          : user.role === 'admin'
                            ? 'text-purple-600 bg-purple-50'
                            : 'text-green-600 bg-green-50'
                      }`}>
                        {user.isBlock ? 'BLOCKED' : user.role?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-light text-gray-400">
                        Joined {formatDate(user.created_at)}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>Cart: {user.cart?.length || 0}</span>
                        <span>Wishlist: {user.wishlist?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-light">No users found</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full text-center text-sm font-light tracking-widest uppercase text-gray-500 hover:text-black transition duration-300"
              >
                View All Users →
              </button>
            </div>
          </div>

          {/* Recent Products */}
          <div className="border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-light tracking-widest uppercase">
                  RECENT PRODUCTS
                </h2>
                <span className="text-xs font-light text-gray-500 bg-gray-100 px-2 py-1">
                  {recentProducts.length} ITEMS
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => {
                  const stockStatus = getStockStatus(product.count);
                  return (
                    <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition duration-300 cursor-pointer"
                      onClick={() => navigate('/admin/products')}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-light text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm font-light text-gray-500 capitalize">
                            {product.category} • {product.gender}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-light tracking-wide ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-light text-gray-600">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Stock: {product.count}</span>
                          {product.featured && (
                            <span className="text-blue-600">FEATURED</span>
                          )}
                          {product.new && (
                            <span className="text-green-600">NEW</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-light">No products found</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full text-center text-sm font-light tracking-widest uppercase text-gray-500 hover:text-black transition duration-300"
              >
                View All Products →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-lg font-light tracking-widest uppercase text-center mb-8">
            QUICK ACTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <button 
              onClick={() => navigate('/admin/products/add')}
              className="border border-black text-black px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300 text-center"
            >
              Add New Product
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="border border-gray-300 text-gray-600 px-8 py-4 text-sm font-light tracking-widest uppercase hover:border-black hover:text-black transition duration-300 text-center"
            >
              Manage Users
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="border border-gray-300 text-gray-600 px-8 py-4 text-sm font-light tracking-widest uppercase hover:border-black hover:text-black transition duration-300 text-center"
            >
              View Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;