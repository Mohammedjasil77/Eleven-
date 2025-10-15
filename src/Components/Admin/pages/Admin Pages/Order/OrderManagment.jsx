import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../../Api/Apipage";
import AdminLayout from "../../../Layout/AdminLayout";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch all orders (from all users)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");

      const allOrders = [];

      response.data.forEach((user) => {
        if (user.orders && user.orders.length > 0) {
          user.orders.forEach((order) => {
            allOrders.push({
              id: order.id,
              orderId: order.id,
              date: order.date,
              status: order.status || "pending",
              items: order.items || [],
              subtotal: order.subtotal || 0,
              shipping: order.shipping || 0,
              tax: order.tax || 0,
              total: order.total || 0,
              shippingInfo: order.shippingInfo || {},
              paymentInfo: order.paymentInfo || {},
              shippingMethod: order.shippingMethod || {},
              userId: user.id,
              customerName: user.name,
              customerEmail: user.email,
              originalOrder: order,
              originalUser: user,
            });
          });
        }
      });

      // Sort newest first
      allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update Order Status (JSON Server compatible)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === orderId);
      if (!orderToUpdate) return alert("Order not found");

      // 1️⃣ Fetch full user
      const userResponse = await api.get(`/users/${orderToUpdate.userId}`);
      const userData = userResponse.data;

      // 2️⃣ Update order in user's orders array
      const updatedOrders = userData.orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );

      // 3️⃣ PUT updated user back
      await api.put(`/users/${orderToUpdate.userId}`, {
        ...userData,
        orders: updatedOrders,
      });

      // 4️⃣ Update frontend immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      alert("✅ Order status updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("❌ Failed to update order. Please try again.");
    }
  };

  // 🗑️ Delete Order
  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      const orderToDelete = orders.find((o) => o.id === orderId);
      if (!orderToDelete) return;

      const userResponse = await api.get(`/users/${orderToDelete.userId}`);
      const userData = userResponse.data;

      const updatedOrders = userData.orders.filter((o) => o.id !== orderId);

      await api.put(`/users/${orderToDelete.userId}`, {
        ...userData,
        orders: updatedOrders,
      });

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      alert("🗑️ Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("❌ Failed to delete order");
    }
  };

  // 🔍 View Order Details
  const viewOrderDetails = (order) => {
    navigate(`/admin/orders/${order.id}`, {
      state: {
        orderDetails: order.originalOrder,
        userDetails: order.originalUser,
      },
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerEmail.toLowerCase().includes(searchLower);
    
    return matchesStatus && matchesSearch;
  });

  // Stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };


    
  return (
  
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Manage and track all customer orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Orders
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total', value: orderStats.total, color: 'text-gray-900', bg: 'bg-gray-500' },
            { label: 'Pending', value: orderStats.pending, color: 'text-yellow-600', bg: 'bg-yellow-500' },
            { label: 'Processing', value: orderStats.processing, color: 'text-blue-600', bg: 'bg-blue-500' },
            { label: 'Shipped', value: orderStats.shipped, color: 'text-purple-600', bg: 'bg-purple-500' },
            { label: 'Delivered', value: orderStats.delivered, color: 'text-green-600', bg: 'bg-green-500' },
            { label: 'Cancelled', value: orderStats.cancelled, color: 'text-red-600', bg: 'bg-red-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${stat.bg} mr-3`}></div>
                <div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        #{order.id}
                      </div>
                      {order.shippingMethod?.name && (
                        <div className="text-xs text-gray-500 mt-1">
                          {order.shippingMethod.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      {order.shippingInfo?.city && (
                        <div className="text-xs text-gray-400 mt-1">
                          {order.shippingInfo.city}, {order.shippingInfo.state}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {order.items.slice(0, 2).map(item => item.name).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Subtotal: {formatPrice(order.subtotal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-4">
                {orders.length === 0 
                  ? "No orders have been placed yet." 
                  : "No orders match your current filters."}
              </p>
              {orders.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
   
  );
};

export default AdminOrders;