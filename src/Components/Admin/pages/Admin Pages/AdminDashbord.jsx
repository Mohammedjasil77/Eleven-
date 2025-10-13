// src/Pages/Admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../Api/Apipage";
import AdminLayout from "../../Layout/AdminLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    blockedUsers: 0,
    lowStockProducts: 0,
    totalSales: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
        api.get("/users").catch(() => ({ data: [] })),
        api.get("/products").catch(() => ({ data: [] })),
        api.get("/orders").catch(() => ({ data: [] })) // Adjust endpoint if different
      ]);

      const users = usersResponse?.data || [];
      const products = productsResponse?.data || [];
      const orders = ordersResponse?.data || [];

      console.log('Fetched data:', { users, products, orders });

      // Calculate stats based on your actual API data structure
      const totalUsers = users.length;
      const blockedUsers = users.filter(user => user.isBlocked || user.isBlock || user.status === 'blocked').length;
      const totalProducts = products.length;
      const lowStockProducts = products.filter(product => 
        product.count < 10 || product.stock < 10 || product.quantity < 10
      ).length;
      const totalOrders = orders.length;
      
      // Calculate revenue from orders or products
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.totalAmount || order.total || order.price || 0);
      }, 0);

      // Calculate total sales (sum of quantities in orders)
      const totalSales = orders.reduce((sum, order) => {
        const orderQuantity = order.items?.reduce((itemSum, item) => 
          itemSum + (item.quantity || item.count || 0), 0) || 0;
        return sum + orderQuantity;
      }, 0);

      // Calculate inventory value from products
      const totalInventoryValue = products.reduce((sum, product) => {
        const price = product.price || product.cost || 0;
        const quantity = product.count || product.stock || product.quantity || 0;
        return sum + (price * quantity);
      }, 0);

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        revenue: totalRevenue > 0 ? totalRevenue : totalInventoryValue, // Fallback to inventory value if no orders
        blockedUsers,
        lowStockProducts,
        totalSales: totalSales > 0 ? totalSales : Math.floor(totalInventoryValue / 10000) // Fallback calculation
      });

      // Get recent users (last 5)
      const sortedUsers = users
        .sort((a, b) => new Date(b.createdAt || b.created_at || b.date) - new Date(a.createdAt || a.created_at || a.date))
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      // Get recent products (last 5)
      const sortedProducts = products
        .sort((a, b) => new Date(b.createdAt || b.created_at || b.date) - new Date(a.createdAt || a.created_at || a.date))
        .slice(0, 5);
      setRecentProducts(sortedProducts);

      // Generate sales data for charts
      generateChartData(products, orders);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please check your API connection.");
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (products, orders) => {
    // Generate monthly sales data based on orders
    const currentMonth = new Date().getMonth();
    const monthlySales = MONTHS.map((month, index) => {
      // Filter orders for this month (mock - adjust based on your order data structure)
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate || order.createdAt || order.date);
        return orderDate.getMonth() === index;
      });
      
      const monthlyRevenue = monthOrders.reduce((sum, order) => 
        sum + (order.totalAmount || order.total || 0), 0
      );
      
      const monthlySales = monthOrders.reduce((sum, order) => 
        sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0), 0
      );

      return {
        name: month,
        sales: monthlySales || Math.floor(Math.random() * 50) + 10, // Fallback to mock data
        revenue: monthlyRevenue || Math.floor(Math.random() * 30000) + 5000, // Fallback to mock data
      };
    }).slice(0, currentMonth + 1); // Only show months up to current month

    setSalesData(monthlySales);

    // Category distribution from products
    const categoryDistribution = products.reduce((acc, product) => {
      const category = product.category || product.type || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryDistribution).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
    setCategoryData(categoryData);
  };

  const setFallbackData = () => {
    // Fallback data structure matching your API
    const users = [
      { 
        id: "1", 
        name: "Mohammed Jasil", 
        email: "jasil@example.com", 
        role: "user", 
        isBlock: false, 
        createdAt: "2025-09-28T10:00:00Z",
        cart: [],
        wishlist: []
      },
      { 
        id: "2", 
        name: "Admin User", 
        email: "admin@shoestore.com", 
        role: "admin", 
        isBlock: false, 
        createdAt: "2025-09-27T11:30:00Z",
        cart: [],
        wishlist: []
      },
    ];

    const products = [
      { 
        id: "1", 
        name: "GG Marmont Matelassé Sneaker", 
        price: 98000, 
        count: 15, 
        createdAt: "2025-09-25T09:00:00Z", 
        category: "Sneakers", 
        gender: "women" 
      },
      { 
        id: "2", 
        name: "Rhython Platform Leather", 
        price: 120000, 
        count: 8, 
        createdAt: "2025-09-25T09:15:00Z", 
        category: "Boots", 
        gender: "women" 
      },
    ];

    const totalUsers = users.length;
    const blockedUsers = users.filter(user => user.isBlock).length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(product => product.count < 10).length;
    const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.count), 0);

    setStats({
      totalUsers,
      totalProducts,
      totalOrders: 8,
      revenue: 320000,
      blockedUsers,
      lowStockProducts,
      totalSales: 15
    });

    setRecentUsers(users.slice(0, 5));
    setRecentProducts(products.slice(0, 5));
    generateChartData(products, []);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStockStatus = (product) => {
    const count = product.count || product.stock || product.quantity || 0;
    if (count === 0) return { text: 'OUT OF STOCK', color: 'bg-red-100 text-red-800' };
    if (count < 5) return { text: 'LOW STOCK', color: 'bg-orange-100 text-orange-800' };
    if (count < 10) return { text: 'LIMITED', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'IN STOCK', color: 'bg-green-100 text-green-800' };
  };

  const getUserStatus = (user) => {
    if (user.isBlocked || user.isBlock || user.status === 'blocked') {
      return { text: 'Blocked', color: 'bg-red-100 text-red-800' };
    }
    if (user.role === 'admin') {
      return { text: 'Admin', color: 'bg-purple-100 text-purple-800' };
    }
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      // <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm font-medium text-gray-600">
              Loading Dashboard Data...
            </p>
          </div>
        </div>
    );
  }

  return (
    // <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600">Real-time analytics and insights</p>
            </div>
            <button 
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div 
            onClick={() => navigate('/admin/users')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`px-2 py-1 rounded-full ${stats.blockedUsers > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {stats.blockedUsers} blocked
              </span>
            </div>
          </div>

          {/* Total Products */}
          <div 
            onClick={() => navigate('/admin/products')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                {stats.lowStockProducts} low stock
              </span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.revenue)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {stats.totalSales} total sales
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              All time orders
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [name === 'sales' ? value : formatPrice(value), name === 'sales' ? 'Units Sold' : 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Units Sold"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatPrice(value), 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10B981" 
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Products']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Users & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => {
                    const userStatus = getUserStatus(user);
                    return (
                      <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                            <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${userStatus.color}`}>
                          {userStatus.text}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">No users found</div>
                )}
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                <button 
                  onClick={() => navigate('/admin/products')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name || 'Unnamed Product'}</p>
                          <p className="text-xs text-gray-500">
                            {formatPrice(product.price || 0)} • {product.category || 'Uncategorized'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">No products found</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/admin/products/add')}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium"
            >
              Add New Product
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition duration-300 text-sm font-medium"
            >
              Manage Users
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition duration-300 text-sm font-medium"
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    // {/* // </AdminLayout> */}
  );
};

export default AdminDashboard;