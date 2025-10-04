import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState("1"); // In real app, get from auth context

  // Fetch cart data for logged-in user
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch user data to get cart items
        const userResponse = await fetch(`http://localhost:5000/users/${currentUserId}`);
        const userData = await userResponse.json();
        
        if (!userData.cart || userData.cart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // 2. Fetch all products to get product details
        const productsResponse = await fetch('http://localhost:5000/products');
        const productsData = await productsResponse.json();

        // 3. Merge cart items with product information
        const mergedCartItems = userData.cart.map(cartItem => {
          const product = productsData.find(p => p.id === cartItem.productId);
          if (!product) return null;

          return {
            id: cartItem.id,
            productId: cartItem.productId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            size: cartItem.size,
            color: cartItem.color,
            quantity: cartItem.quantity,
            maxQuantity: product.count,
            category: product.category,
            isInStock: product.count > 0
          };
        }).filter(item => item !== null); // Remove any null items

        setCartItems(mergedCartItems);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [currentUserId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Update quantity in cart
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // Optimistic UI update
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Update in backend
      const userResponse = await fetch(`http://localhost:5000/users/${currentUserId}`);
      const userData = await userResponse.json();
      
      const updatedCart = userData.cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      await fetch(`http://localhost:5000/users/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        })
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert optimistic update on error
      const userResponse = await fetch(`http://localhost:5000/users/${currentUserId}`);
      const userData = await userResponse.json();
      // Re-fetch cart data to revert
      const productsResponse = await fetch('http://localhost:5000/products');
      const productsData = await productsResponse.json();
      const mergedCartItems = userData.cart.map(cartItem => {
        const product = productsData.find(p => p.id === cartItem.productId);
        return product ? {
          id: cartItem.id,
          productId: cartItem.productId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          size: cartItem.size,
          color: cartItem.color,
          quantity: cartItem.quantity,
          maxQuantity: product.count
        } : null;
      }).filter(item => item !== null);
      setCartItems(mergedCartItems);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      // Optimistic UI update
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

      // Update in backend
      const userResponse = await fetch(`http://localhost:5000/users/${currentUserId}`);
      const userData = await userResponse.json();
      
      const updatedCart = userData.cart.filter(item => item.id !== itemId);

      await fetch(`http://localhost:5000/users/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        })
      });
    } catch (error) {
      console.error('Error removing item:', error);
      // Revert optimistic update on error
      const userResponse = await fetch(`http://localhost:5000/users/${currentUserId}`);
      const userData = await userResponse.json();
      const productsResponse = await fetch('http://localhost:5000/products');
      const productsData = await productsResponse.json();
      const mergedCartItems = userData.cart.map(cartItem => {
        const product = productsData.find(p => p.id === cartItem.productId);
        return product ? {
          id: cartItem.id,
          productId: cartItem.productId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          size: cartItem.size,
          color: cartItem.color,
          quantity: cartItem.quantity,
          maxQuantity: product.count
        } : null;
      }).filter(item => item !== null);
      setCartItems(mergedCartItems);
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscount = () => {
    return cartItems.reduce((total, item) => {
      const originalTotal = item.originalPrice * item.quantity;
      const currentTotal = item.price * item.quantity;
      return total + (originalTotal - currentTotal);
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">Loading Cart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-wide">
              SHOPPING CART
            </h1>
            <p className="text-gray-600 text-sm uppercase tracking-widest font-light">
              Review Your Selection
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-lg font-light tracking-widest uppercase">
                  Your Items ({cartItems.length})
                </h2>
              </div>

              {/* Cart Items List */}
              <div className="space-y-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100">
                    {/* Product Image */}
                    <div className="sm:w-32 sm:h-32 w-full h-48 flex-shrink-0">
                      <Link to={`/product/${item.productId}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:opacity-90 transition duration-300"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col h-full">
                        {/* Product Info */}
                        <div className="flex-1">
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="text-lg font-light tracking-wide mb-2 hover:text-gray-600 transition duration-300">
                              {item.name}
                            </h3>
                          </Link>
                          
                          {/* Price */}
                          <div className="flex items-center gap-3 mb-3">
                            <p className="text-gray-600 font-light tracking-widest">
                              {formatPrice(item.price)}
                            </p>
                            {item.originalPrice > item.price && (
                              <p className="text-gray-400 text-sm font-light line-through">
                                {formatPrice(item.originalPrice)}
                              </p>
                            )}
                            {item.originalPrice > item.price && (
                              <span className="text-red-600 text-sm font-light">
                                Save {formatPrice(item.originalPrice - item.price)}
                              </span>
                            )}
                          </div>

                          {/* Size & Color */}
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-light">Size: </span>
                              <span className="font-medium">{item.size}</span>
                            </div>
                            <div>
                              <span className="font-light">Color: </span>
                              <span className="font-medium capitalize">{item.color}</span>
                            </div>
                          </div>

                          {/* Stock Status */}
                          <div className="text-sm">
                            {item.quantity > item.maxQuantity ? (
                              <span className="text-red-600 font-light">
                                Only {item.maxQuantity} available
                              </span>
                            ) : (
                              <span className="text-green-600 font-light">
                                In Stock ({item.maxQuantity} available)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-3 py-2 text-gray-600 hover:text-black transition duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 text-sm font-light tracking-widest min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxQuantity}
                              className="px-3 py-2 text-gray-600 hover:text-black transition duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm font-light tracking-widest uppercase text-gray-500 hover:text-black transition duration-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="sm:w-24 text-right">
                      <p className="text-lg font-light tracking-widest">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-sm font-light tracking-widest uppercase border-b border-black hover:opacity-70 transition duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="border border-gray-200 p-6">
                  <h2 className="text-lg font-light tracking-widest uppercase mb-6">
                    Order Summary
                  </h2>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-light text-gray-600">Subtotal</span>
                      <span className="font-light">{formatPrice(getSubtotal())}</span>
                    </div>
                    
                    {getDiscount() > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="font-light text-gray-600">Discount</span>
                        <span className="font-light text-green-600">-{formatPrice(getDiscount())}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-light text-gray-600">Shipping</span>
                      <span className="font-light text-green-600">Free</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-light text-gray-600">Tax</span>
                      <span className="font-light">Calculated at checkout</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-light">Total</span>
                        <span className="font-light tracking-widest">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300 mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Security Notice */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-light">
                      <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure checkout guaranteed
                    </p>
                  </div>
                </div>

                {/* Promotional Banner */}
                <div className="mt-6 bg-gray-50 p-6 text-center">
                  <h3 className="text-sm font-light tracking-widest uppercase mb-2">
                    Free Shipping
                  </h3>
                  <p className="text-xs text-gray-600 font-light mb-3">
                    Enjoy complimentary worldwide shipping on all orders
                  </p>
                  <div className="w-12 h-px bg-gray-300 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-2xl font-light tracking-wide text-gray-600 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 font-light mb-8">
                Discover our latest collection and find something you'll love.
              </p>
              <div className="space-x-4">
                <Link
                  to="/shop"
                  className="inline-block bg-black text-white px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
                >
                  Start Shopping
                </Link>
                <Link
                  to="/new-arrivals"
                  className="inline-block border border-black text-black px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CartPage;