import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../../Api/Apipage";

const OrderTrackingDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        if (user) {
          // Get user data to find the specific order
          const userResponse = await api.get(`/users/${user.id}`);
          const userData = userResponse.data;
          
          // Find the specific order
          const foundOrder = userData.orders?.find(order => order.id === orderId);
          
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            // If not found in user orders, try the main orders collection
            const ordersResponse = await api.get(`/orders?userId=${user.id}`);
            const orderFromCollection = ordersResponse.data.find(order => order.id === orderId);
            setOrder(orderFromCollection || null);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = (status) => {
    const steps = [
      { name: 'Order Placed', status: 'processing', completed: true },
      { name: 'Confirmed', status: 'confirmed', completed: ['confirmed', 'shipped', 'delivered'].includes(status) },
      { name: 'Shipped', status: 'shipped', completed: ['shipped', 'delivered'].includes(status) },
      { name: 'Delivered', status: 'delivered', completed: status === 'delivered' }
    ];
    return steps;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-sm font-light">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-light mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate('/track-order')}
              className="bg-black text-white px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
                Order Tracking
              </h1>
              <p className="text-gray-600">
                Order #{order.id} • Placed on {formatDate(order.date)}
              </p>
            </div>
            <button
              onClick={() => navigate('/track-order')}
              className="text-sm font-light tracking-widest uppercase text-gray-600 hover:text-black transition duration-300"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-serif font-light mb-6">Order Status</h2>
          
          <div className="flex items-center justify-between mb-8">
            <div className="text-center">
              <span className={`inline-block w-12 h-12 rounded-full ${getStatusColor(order.status)} text-white flex items-center justify-center text-sm font-medium mb-2`}>
                {statusSteps.findIndex(step => step.status === order.status) + 1}
              </span>
              <span className="text-sm font-medium text-gray-900">{getStatusText(order.status)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center text-gray-600">{step.name}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 -z-10">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ 
                  width: `${(statusSteps.filter(step => step.completed).length / statusSteps.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {order.status === 'processing' && 'Your order is being processed'}
              {order.status === 'confirmed' && 'Your order has been confirmed'}
              {order.status === 'shipped' && 'Your order has been shipped'}
              {order.status === 'delivered' && 'Your order has been delivered'}
            </p>
            <p className="text-gray-600">
              {order.status === 'processing' && 'We are preparing your items for shipment.'}
              {order.status === 'confirmed' && 'Your order is confirmed and will be shipped soon.'}
              {order.status === 'shipped' && `Expected delivery: ${order.shippingMethod?.delivery || '5-7 business days'}`}
              {order.status === 'delivered' && 'Your order has been successfully delivered.'}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-serif font-light mb-6">Order Details</h2>
          
          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 py-4 border-b border-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded"
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

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18% GST)</span>
                <span className="font-medium">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-serif font-light mb-6">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
              <p className="text-gray-600">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                {order.shippingInfo.address}<br />
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}<br />
                {order.shippingInfo.country}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <p className="text-gray-600">
                {order.shippingInfo.email}<br />
                {order.shippingInfo.phone}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Shipping Method</h4>
              <p className="text-gray-600">
                {order.shippingMethod?.name}<br />
                {order.shippingMethod?.delivery}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
              <p className="text-gray-600">
                Card ending in {order.paymentInfo?.cardNumber?.slice(-4)}<br />
                Expires {order.paymentInfo?.expiryDate}
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help with Your Order?</h3>
          <p className="text-gray-600 mb-4">
            Contact our customer support for any questions about your order.
          </p>
          <Link
            to="/contact"
            className="inline-block border border-black text-black px-6 py-2 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingDetail;