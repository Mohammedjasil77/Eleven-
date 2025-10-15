import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../../Layout/AdminLayout";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderDetails, userDetails } = state || {};

  if (!orderDetails || !userDetails) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">No order details available.</p>
            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/admin/orders")}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Orders
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600">Order #{orderDetails.id}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Order Status</div>
            <div className="text-lg font-semibold text-gray-900 capitalize">{orderDetails.status}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Order Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Order ID:</span>
                <span className="text-gray-900 font-mono">#{orderDetails.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Order Date:</span>
                <span className="text-gray-900">{formatDate(orderDetails.date)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Order Status:</span>
                <span className="text-gray-900 capitalize">{orderDetails.status}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Total Amount:</span>
                <span className="text-green-600 font-bold text-lg">
                  {formatPrice(orderDetails.total)}
                </span>
              </div>

              {orderDetails.subtotal && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">{formatPrice(orderDetails.subtotal)}</span>
                </div>
              )}

              {orderDetails.shipping && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">{formatPrice(orderDetails.shipping)}</span>
                </div>
              )}

              {orderDetails.tax && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">{formatPrice(orderDetails.tax)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-gray-600 font-medium mb-1">Customer Name</div>
                <div className="text-gray-900 text-lg font-semibold">{userDetails.name}</div>
              </div>
              
              <div>
                <div className="text-gray-600 font-medium mb-1">Email Address</div>
                <div className="text-gray-900">{userDetails.email}</div>
              </div>

              {orderDetails.shippingInfo && (
                <>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-gray-600 font-medium mb-2">Shipping Address</div>
                    <div className="text-gray-900 space-y-1">
                      {orderDetails.shippingInfo.firstName && orderDetails.shippingInfo.lastName && (
                        <div>{orderDetails.shippingInfo.firstName} {orderDetails.shippingInfo.lastName}</div>
                      )}
                      {orderDetails.shippingInfo.address && (
                        <div>{orderDetails.shippingInfo.address}</div>
                      )}
                      {orderDetails.shippingInfo.city && (
                        <div>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state}</div>
                      )}
                      {orderDetails.shippingInfo.zipCode && (
                        <div>{orderDetails.shippingInfo.zipCode}</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Order Items ({orderDetails.items?.length || 0})
          </h2>
          
          {orderDetails.items && orderDetails.items.length > 0 ? (
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">📦</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.name || `Item ${index + 1}`}</div>
                      <div className="text-sm text-gray-500">
                        Quantity: {item.quantity || 1}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(item.price)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p>No items found in this order</p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Shipping Information */}
          {orderDetails.shippingInfo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Shipping Information
              </h2>
              
              <div className="space-y-3">
                {orderDetails.shippingInfo.firstName && orderDetails.shippingInfo.lastName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient:</span>
                    <span className="text-gray-900">
                      {orderDetails.shippingInfo.firstName} {orderDetails.shippingInfo.lastName}
                    </span>
                  </div>
                )}
                
                {orderDetails.shippingInfo.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="text-gray-900 text-right">{orderDetails.shippingInfo.address}</span>
                  </div>
                )}
                
                {orderDetails.shippingInfo.city && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="text-gray-900">{orderDetails.shippingInfo.city}</span>
                  </div>
                )}
                
                {orderDetails.shippingInfo.state && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="text-gray-900">{orderDetails.shippingInfo.state}</span>
                  </div>
                )}
                
                {orderDetails.shippingInfo.zipCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ZIP Code:</span>
                    <span className="text-gray-900">{orderDetails.shippingInfo.zipCode}</span>
                  </div>
                )}
                
                {orderDetails.shippingInfo.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-900">{orderDetails.shippingInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {(orderDetails.paymentInfo || orderDetails.shippingMethod) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Additional Information
              </h2>
              
              <div className="space-y-3">
                {orderDetails.paymentInfo?.method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900">{orderDetails.paymentInfo.method}</span>
                  </div>
                )}
                
                {orderDetails.shippingMethod?.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span className="text-gray-900">{orderDetails.shippingMethod.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;