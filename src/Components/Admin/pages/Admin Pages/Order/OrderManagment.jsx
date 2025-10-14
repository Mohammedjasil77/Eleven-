// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../../../../Api/Apipage";

// const OrderManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await api.get("/users");
      
//       // Transform the data to match your actual structure
//       const formattedOrders = (response.data || []).map(order => ({
//         id: order.id || order._id,
//         orderId: order.id,
//         customerName: order.shippingInfo ? 
//           `${order.shippingInfo.firstName || ''} ${order.shippingInfo.lastName || ''}`.trim() : 
//           'Customer',
//         customerEmail: order.shippingInfo?.email || 'N/A',
//         items: order.items || [],
//         totalAmount: order.total || order.totalAmount || 0,
//         status: order.status || 'pending',
//         orderDate: order.date || order.orderDate || order.createdAt || new Date().toISOString(),
//         // Include all original data for details view
//         originalOrder: order
//       }));
      
//       setOrders(formattedOrders);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("Failed to load orders. Please check if the orders API is accessible.");
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       await api.patch(`/orders/${orderId}`, { status: newStatus });
      
//       // Update local state immediately for better UX
//       setOrders(prevOrders => 
//         prevOrders.map(order => 
//           order.id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
      
//     } catch (error) {
//       console.error("Error updating order:", error);
//       alert("Failed to update order status. Please try again.");
//       // Revert on error
//       fetchOrders();
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed':
//         return 'bg-blue-100 text-blue-800';
//       case 'shipped':
//         return 'bg-purple-100 text-purple-800';
//       case 'delivered':
//         return 'bg-green-100 text-green-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(price);
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const viewOrderDetails = (order) => {
//     // Navigate to order details page with full order data
//     navigate(`/admin/orders/${order.id}`, { state: { order: order.originalOrder || order } });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex justify-center items-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-3 text-gray-600">Loading orders...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
//           <p className="text-gray-600">Manage customer orders and track fulfillment</p>
//         </div>
//         <button
//           onClick={fetchOrders}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//           </svg>
//           Refresh Orders
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//           {error}
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//         {[
//           { label: 'Total Orders', value: orders.length, color: 'text-gray-900' },
//           { label: 'Pending', value: orders.filter(o => o.status?.toLowerCase() === 'pending').length, color: 'text-yellow-600' },
//           { label: 'Confirmed', value: orders.filter(o => o.status?.toLowerCase() === 'confirmed').length, color: 'text-blue-600' },
//           { label: 'Shipped', value: orders.filter(o => o.status?.toLowerCase() === 'shipped').length, color: 'text-purple-600' },
//           { label: 'Delivered', value: orders.filter(o => o.status?.toLowerCase() === 'delivered').length, color: 'text-green-600' },
//         ].map((stat, index) => (
//           <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <div className="text-sm text-gray-600">{stat.label}</div>
//             <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Items
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {orders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">#{order.id}</div>
//                     {order.originalOrder?.shippingMethod && (
//                       <div className="text-xs text-gray-500 capitalize">
//                         {order.originalOrder.shippingMethod.name}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
//                     <div className="text-sm text-gray-500">{order.customerEmail}</div>
//                     {order.originalOrder?.shippingInfo?.city && (
//                       <div className="text-xs text-gray-400">
//                         {order.originalOrder.shippingInfo.city}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900">{order.items.length} items</div>
//                     <div className="text-xs text-gray-500">
//                       {order.items.slice(0, 2).map(item => item.name).join(', ')}
//                       {order.items.length > 2 && ` +${order.items.length - 2} more`}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
//                     {formatPrice(order.totalAmount)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                       {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-2">
//                       <select
//                         value={order.status || 'pending'}
//                         onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                         className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="confirmed">Confirmed</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="delivered">Delivered</option>
//                         <option value="cancelled">Cancelled</option>
//                       </select>
//                       {/* <button
//                         onClick={() => viewOrderDetails(order)}
//                         className="text-blue-600 hover:text-blue-900 text-xs underline"
//                       >
//                         Details
//                       </button> */}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {orders.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">📦</div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-500 mb-4">
//               {error ? "Unable to load orders. Please check your connection." : "No orders have been placed yet."}
//             </p>
//             <button
//               onClick={fetchOrders}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderManagement;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../../Api/Apipage";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/users");
      
      // Extract orders from all users and flatten them
      const allOrders = [];
      
      response.data.forEach(user => {
        if (user.orders && user.orders.length > 0) {
          user.orders.forEach(order => {
            allOrders.push({
              // Order details
              id: order.id,
              orderId: order.id,
              date: order.date,
              status: order.status || 'pending',
              items: order.items || [],
              subtotal: order.subtotal || 0,
              shipping: order.shipping || 0,
              tax: order.tax || 0,
              total: order.total || 0,
              
              // Shipping info
              shippingInfo: order.shippingInfo || {},
              paymentInfo: order.paymentInfo || {},
              shippingMethod: order.shippingMethod || {},
              
              // User info
              userId: user.id,
              customerName: user.name,
              customerEmail: user.email,
              userName: user.name,
              userEmail: user.email,
              
              // Original data for details
              originalOrder: order,
              originalUser: user
            });
          });
        }
      });
      
      // Sort by date (newest first)
      allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please check if the API is accessible.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Since orders are nested in users, we need to find the user first
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) return;

      // In a real API, you might have a dedicated endpoint for updating orders
      // For now, we'll update locally and simulate API call
      await api.patch(`/users/${orderToUpdate.userId}/orders/${orderId}`, { 
        status: newStatus 
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status. Please try again.");
      // Revert on error
      fetchOrders();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const viewOrderDetails = (order) => {
    navigate(`/admin/orders/${order.id}`, { 
      state: { 
        order: order.originalOrder || order,
        user: order.originalUser 
      } 
    });
  };

  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter;
    const matchesSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingInfo?.firstName && order.shippingInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.shippingInfo?.lastName && order.shippingInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage customer orders and track fulfillment</p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Orders
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-gray-900', bg: 'bg-gray-500' },
          { label: 'Pending', value: orders.filter(o => o.status?.toLowerCase() === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-500' },
          { label: 'Confirmed', value: orders.filter(o => o.status?.toLowerCase() === 'confirmed').length, color: 'text-blue-600', bg: 'bg-blue-500' },
          { label: 'Shipped', value: orders.filter(o => o.status?.toLowerCase() === 'shipped').length, color: 'text-purple-600', bg: 'bg-purple-500' },
          { label: 'Delivered', value: orders.filter(o => o.status?.toLowerCase() === 'delivered').length, color: 'text-green-600', bg: 'bg-green-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stat.bg} mr-3`}></div>
              <div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
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
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900 text-sm underline text-left"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && !loading && (
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
    </div>
  );
};

export default OrderManagement;