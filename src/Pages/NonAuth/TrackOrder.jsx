import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../../Api/Apipage";
const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      if (user) {
        console.log('🔄 Fetching orders for user:', user.id);
        
        // Get user data to access their orders
        const userResponse = await api.get(`/users/${user.id}`);
        const userData = userResponse.data;
        
        console.log('📦 User data from API:', userData);
        console.log('📋 Orders found:', userData.orders);
        
        // User orders are stored in the user object itself
        const userOrders = userData.orders || [];
        console.log('✅ Final orders to display:', userOrders);
        
        setOrders(userOrders);
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUserOrders();
}, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      processing: "bg-yellow-500",
      confirmed: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusText = (status) => {
    const texts = {
      processing: "Processing",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled"
    };
    return texts[status] || status;
  };

  const handleReorder = async (order) => {
    try {
      // Add all items from the order to cart
      const cartPromises = order.items.map(item =>
        api.patch(`/users/${user.id}`, {
          cart: [...(user.cart || []), {
            id: Date.now().toString(),
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity
          }]
        })
      );
      
      await Promise.all(cartPromises);
      navigate('/buy-now');
    } catch (error) {
      console.error("Error reordering:", error);
      alert("Error adding items to cart");
    }
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-sm font-light">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
            Your Orders
          </h1>
          <p className="text-gray-600">
            View your order history and track recent purchases
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!user ? (
          // Not logged in state
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Please Login</h3>
              <p className="text-gray-600 mb-6">
                Please login to view your order history.
              </p>
              <Link
                to="/login"
                className="inline-block bg-black text-white px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          // No Orders State
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-black text-white px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          // Orders List
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} text-white`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex-1 bg-black text-white py-2 px-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
                    >
                      Buy Again
                    </button>
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="flex-1 border border-black text-black py-2 px-4 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
                    >
                      Track Order
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        {orders.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help with Your Order?</h3>
              <p className="text-gray-600 mb-4">
                Contact our customer support for any questions about your orders.
              </p>
              <Link
                to="/contact"
                className="inline-block border border-black text-black px-6 py-2 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;