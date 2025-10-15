import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../Api/Apipage"; // Your axios instance
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
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    blockedUsers: 0,
    lowStockProducts: 0,
    totalSales: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from your actual API endpoints
      const [usersResponse, productsResponse] = await Promise.all([
        api.get("/users"),
        api.get("/products"),
      ]);

      const users = usersResponse?.data || [];
      const products = productsResponse?.data || [];

      console.log("Fetched Users:", users);
      console.log("Fetched Products:", products);

      // Calculate stats from real data
      const totalUsers = users.length;
      const blockedUsers = users.filter((user) => user.isBlock).length;
      const totalProducts = products.length;

      // Calculate low stock products (assuming count field exists)
      const lowStockProducts = products.filter(
        (product) => (product.count || product.stock || 0) < 10
      ).length;

      // Calculate total orders from all users
      const allOrders = users.flatMap((user) => user.orders || []);
      const totalOrders = allOrders.length;

      // Calculate revenue from all orders
      const totalRevenue = allOrders.reduce((sum, order) => {
        return sum + Number(order.total || order.totalAmount || 0);
      }, 0);

      // Calculate total sales (sum of quantities in all orders)
      const totalSales = allOrders.reduce((sum, order) => {
        const orderQuantity =
          order.items?.reduce(
            (itemSum, item) => itemSum + (item.quantity || 1),
            0
          ) || 0;
        return sum + orderQuantity;
      }, 0);

      // Calculate inventory value
      const totalInventoryValue = products.reduce((sum, product) => {
        const price = product.price || 0;
        const quantity = product.count || product.stock || 0;
        return sum + price * quantity;
      }, 0);

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        revenue: totalRevenue > 0 ? totalRevenue : totalInventoryValue,
        blockedUsers,
        lowStockProducts,
        totalSales,
      });

      // Get recent users (last 5)
      const sortedUsers = users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      // Get recent products (last 5)
      const sortedProducts = products
        .sort(
          (a, b) =>
            new Date(b.created_at || b.createdAt) -
            new Date(a.created_at || a.createdAt)
        )
        .slice(0, 5);
      setRecentProducts(sortedProducts);

      // Generate sales data from actual orders
      generateChartData(products, allOrders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(
        "Failed to load dashboard data. Please check if the server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  // const generateChartData = (products, orders) => {
  //   // Generate monthly sales data based on actual orders
  //   const monthlyData = {};

  //   orders.forEach(order => {
  //     const orderDate = new Date(order.date || order.createdAt);
  //     const monthYear = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
  //     const monthName = orderDate.toLocaleDateString('en-US', { month: 'short' });

  //     if (!monthlyData[monthYear]) {
  //       monthlyData[monthYear] = {
  //         name: monthName,
  //         sales: 0,
  //         revenue: 0,
  //         orders: 0
  //       };
  //     }

  //     monthlyData[monthYear].sales += order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  //     monthlyData[monthYear].revenue += order.total || 0;
  //     monthlyData[monthYear].orders += 1;
  //   });

  //   // Convert to array and sort by date
  //   const chartData = Object.values(monthlyData)
  //     .sort((a, b) => {
  //       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //       return months.indexOf(a.name) - months.indexOf(b.name);
  //     });

  //   setSalesData(chartData.length > 0 ? chartData : generateFallbackChartData());

  //   // Category distribution from actual products
  //   const categoryDistribution = products.reduce((acc, product) => {
  //     const category = product.category || product.type || 'Uncategorized';
  //     if (!acc[category]) {
  //       acc[category] = 0;
  //     }
  //     acc[category]++;
  //     return acc;
  //   }, {});

  //   const categoryData = Object.entries(categoryDistribution).map(([name, value], index) => ({
  //     name,
  //     value,
  //     color: COLORS[index % COLORS.length]
  //   }));

  //   setCategoryData(categoryData.length > 0 ? categoryData : generateFallbackCategoryData());
  // };

  const generateChartData = (products, orders) => {
    // Generate daily sales data based on actual orders
    const dailyData = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.date || order.createdAt);
      const dayKey = orderDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          name: dayKey, // Label on chart
          sales: 0,
          revenue: 0,
          orders: 0,
        };
      }

      dailyData[dayKey].sales +=
        order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
      dailyData[dayKey].revenue += Number(
        order.total || order.totalAmount || 0
      );
      dailyData[dayKey].orders += 1;
    });

    // Convert to array and sort by date
    const chartData = Object.values(dailyData).sort(
      (a, b) => new Date(a.name) - new Date(b.name)
    );

    setSalesData(
      chartData.length > 0 ? chartData : generateFallbackChartData()
    );

    // Category distribution from actual products
    const categoryDistribution = products.reduce((acc, product) => {
      const category = product.category || product.type || "Uncategorized";
      if (!acc[category]) acc[category] = 0;
      acc[category]++;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryDistribution).map(
      ([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      })
    );

    setCategoryData(
      categoryData.length > 0 ? categoryData : generateFallbackCategoryData()
    );
  };

  // Fallback data for charts when no real data exists
  const generateFallbackChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      name: month,
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 30000) + 5000,
      orders: Math.floor(Math.random() * 10) + 1,
    }));
  };

  const generateFallbackCategoryData = () => {
    return [
      { name: "Sneakers", value: 35, color: "#0088FE" },
      { name: "Boots", value: 25, color: "#00C49F" },
      { name: "Sandals", value: 20, color: "#FFBB28" },
      { name: "Formal", value: 15, color: "#FF8042" },
      { name: "Sports", value: 5, color: "#8884D8" },
    ];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
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

  const getUserStatus = (user) => {
    if (user.isBlock) {
      return { text: "Blocked", color: "bg-red-100 text-red-800" };
    }
    if (user.role === "admin") {
      return { text: "Admin", color: "bg-purple-100 text-purple-800" };
    }
    return { text: "Active", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Real-time analytics from your database
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium w-full sm:w-auto"
          >
            Refresh Data
          </button>
        </div>
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Users */}
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 cursor-pointer hover:shadow-md transition duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Users
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <span className="text-lg sm:text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                stats.blockedUsers > 0
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {stats.blockedUsers} blocked
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div
          onClick={() => navigate("/admin/products")}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 cursor-pointer hover:shadow-md transition duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalProducts}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <span className="text-lg sm:text-2xl">📦</span>
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              {stats.lowStockProducts} low stock
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Revenue
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.revenue}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <span className="text-lg sm:text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            {stats.totalSales} total sales
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Orders
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
              <span className="text-lg sm:text-2xl">📋</span>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            All time orders
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Sales Trend
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [value, "Units Sold"]} />
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Revenue Overview
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value) => [formatPrice(value), "Revenue"]}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Product Categories
          </h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Products"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users & Products */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Recent Users
              </h3>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => {
                  const userStatus = getUserStatus(user);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {user.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${userStatus.color}`}
                      >
                        {userStatus.text}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-4 text-sm">
                  No users found
                </div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Recent Products
              </h3>
              <button
                onClick={() => navigate("/admin/products")}
                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {product.name || "Unnamed Product"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {formatPrice(product.price || 0)} •{" "}
                          {product.category || "Uncategorized"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${stockStatus.color}`}
                      >
                        {stockStatus.text}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-4 text-sm">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
