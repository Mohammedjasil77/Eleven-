import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../../Api/Apipage";

const BuyNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useContext(AuthContext);

  // State for both single product and cart items
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartCheckout, setIsCartCheckout] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveCard: false
  });

  const [shippingMethod, setShippingMethod] = useState("standard");

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 0,
      delivery: "5-7 business days"
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 500,
      delivery: "2-3 business days"
    },
    {
      id: "nextday",
      name: "Next Day Delivery",
      price: 1000,
      delivery: "Next business day"
    }
  ];

  useEffect(() => {
    // Check if we're coming from cart or single product
    if (location.state?.cartItems && location.state.cartItems.length > 0) {
      // Cart checkout
      setCartItems(location.state.cartItems);
      setIsCartCheckout(true);
    } else if (location.state?.product) {
      // Single product checkout
      setProduct(location.state.product);
      setSelectedSize(location.state.product.sizes?.[0] || "");
      setSelectedColor(location.state.product.colors?.[0] || "");
      setIsCartCheckout(false);
    } else {
      // Redirect if no valid data
      navigate("/shop");
    }

    // Pre-fill user info if available
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.name?.split(' ')[0] || "",
        lastName: user.name?.split(' ')[1] || ""
      }));
    }
  }, [location.state, navigate, user]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentInfo(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentInfo(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.count || 10)) {
      setQuantity(newQuantity);
    }
  };

  // Calculate totals based on cart items or single product
  const calculateSubtotal = () => {
    if (isCartCheckout) {
      return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    } else {
      return product ? (product.price * quantity) : 0;
    }
  };

  const calculateShipping = () => {
    const method = shippingMethods.find(m => m.id === shippingMethod);
    return method ? method.price : 0;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'
    ];
    
    for (let field of requiredFields) {
      if (!shippingInfo[field].trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Only validate size/color for single product checkout
    if (!isCartCheckout) {
      if (!selectedSize) {
        alert("Please select a size");
        return false;
      }

      if (!selectedColor) {
        alert("Please select a color");
        return false;
      }
    }

    if (!paymentInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      alert("Please enter a valid 16-digit card number");
      return false;
    }

    if (!paymentInfo.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      alert("Please enter a valid expiry date (MM/YY)");
      return false;
    }

    if (!paymentInfo.cvv.match(/^\d{3,4}$/)) {
      alert("Please enter a valid CVV");
      return false;
    }

    if (!paymentInfo.nameOnCard.trim()) {
      alert("Please enter name on card");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderItems = isCartCheckout 
        ? cartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image
          }))
        : [{
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor,
            image: product.images?.[0] || "/placeholder-image.jpg"
          }];

      const orderData = {
        id: `ORD${Date.now()}`,
        date: new Date().toISOString(),
        items: orderItems,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`
        },
        shippingMethod: shippingMethods.find(m => m.id === shippingMethod),
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal(),
        status: 'confirmed'
      };

      console.log('Order Data:', orderData);
      console.log('Current User:', user);

      // ✅ CRITICAL: Save order to database
      if (user) {
        try {
          // 1. Get current user data
          const userResponse = await api.get(`/users/${user.id}`);
          const currentUser = userResponse.data;
          console.log('Current User Data:', currentUser);

          // 2. Create updated user with new order
          const updatedUser = {
            ...currentUser,
            orders: [...(currentUser.orders || []), orderData],
            // Clear cart if it was a cart checkout
            cart: isCartCheckout ? [] : currentUser.cart
          };

          // 3. Save updated user to database
          await api.put(`/users/${user.id}`, updatedUser);
          console.log('✅ Order saved to user profile successfully');

        } catch (error) {
          console.error('❌ Error saving order to user profile:', error);
          alert("Failed to save order. Please try again.");
          return;
        }
      } else {
        alert("User not logged in. Please login to complete your order.");
        return;
      }

      // Clear cart from context if this was a cart checkout
      if (isCartCheckout) {
        clearCart();
      }

      setOrderSuccess(true);

    } catch (error) {
      alert("There was an error processing your order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product && !isCartCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-serif font-light mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">Thank you for your purchase, {shippingInfo.firstName}!</p>
            <p className="text-gray-600 mb-6">Your order has been confirmed and will be shipped soon.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-black text-white px-8 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
              >
                Continue Shopping
              </Link>
              <Link
                to="/track-order"
                className="border border-black text-black px-8 py-3 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
              >
                View Your Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Product & Forms */}
          <div className="lg:w-2/3">
            {/* Product Summary - Only show for single product */}
            {!isCartCheckout && product && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Product Images */}
                  <div className="md:w-1/3">
                    <div className="aspect-square overflow-hidden mb-4">
                      <img
                        src={product.images?.[activeImage] || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {product.images && product.images.length > 1 && (
                      <div className="flex gap-2">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`w-12 h-12 border-2 ${
                              activeImage === index ? "border-black" : "border-transparent"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${product.name} view ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="md:w-2/3">
                    <h1 className="text-2xl font-serif font-light mb-4">{product.name}</h1>
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-xl font-light">{formatPrice(product.price)}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-gray-400 text-lg font-light line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Size Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Size *</label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes?.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border text-sm transition duration-300 ${
                              selectedSize === size
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Color *</label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors?.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border text-sm capitalize transition duration-300 ${
                              selectedColor === color
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.count}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          {product.count} available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Summary - Only show for cart checkout */}
            {isCartCheckout && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-serif font-light mb-6">Cart Summary</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100">
                      <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-light">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-light">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-serif font-light mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300 bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-serif font-light mb-6">Shipping Method</h2>
              
              <div className="space-y-4">
                {shippingMethods.map((method) => (
                  <label key={method.id} className="flex items-center justify-between p-4 border border-gray-200 hover:border-black transition duration-300 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.delivery}</div>
                      </div>
                    </div>
                    <div className="font-medium">
                      {method.price === 0 ? 'FREE' : formatPrice(method.price)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-serif font-light mb-6">Payment Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light tracking-widest uppercase mb-2">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light tracking-widest uppercase mb-2">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInfoChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light tracking-widest uppercase mb-2">Name on Card *</label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={handlePaymentInfoChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
                    required
                  />
                </div>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={paymentInfo.saveCard}
                    onChange={handlePaymentInfoChange}
                    className="text-black focus:ring-black"
                  />
                  <span className="text-sm">Save card for future purchases</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sticky top-32">
              <h2 className="text-2xl font-serif font-light mb-6">Order Summary</h2>
              
              {/* Product Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {isCartCheckout ? (
                  // Cart items
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100">
                      <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-light truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-light">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Single product
                  product && (
                    <div className="flex items-center space-x-4 py-4 border-b border-gray-100">
                      <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                        <img
                          src={product.images?.[0] || "/placeholder-image.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-light truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500">
                          Size: {selectedSize || "Not selected"} | Color: {selectedColor || "Not selected"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Quantity: {quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-light">
                          {formatPrice(product.price * quantity)}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax (18% GST)</span>
                  <span>{formatPrice(calculateTax())}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || (!isCartCheckout && (!selectedSize || !selectedColor))}
                className={`w-full py-4 text-sm font-light tracking-widest uppercase mt-6 transition duration-300 ${
                  loading || (!isCartCheckout && (!selectedSize || !selectedColor))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order • ${formatPrice(calculateTotal())}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowPage;