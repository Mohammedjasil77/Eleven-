import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/CartContext";
import { AuthContext } from "../../../Context/AuthContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { 
    cartItems, 
    loading, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getDiscount, 
    getTotal 
  } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed to checkout");
      navigate("/login");
      return;
    }
    navigate("/buy-now");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-light tracking-widest uppercase">
            Loading Cart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-wide">
            SHOPPING CART
          </h1>
          <p className="text-gray-600 text-sm uppercase tracking-widest font-light">
            Review Your Selection
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-lg font-light tracking-widest uppercase">
                  Your Items ({cartItems.length})
                </h2>
              </div>

              <div className="space-y-8">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100"
                  >
                    <div className="sm:w-32 sm:h-32 w-full h-48 flex-shrink-0">
                      <Link to={`/product/${item.productId}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:opacity-90 transition duration-300"
                        />
                      </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="text-lg font-light tracking-wide mb-2 hover:text-gray-600 transition duration-300">
                            {item.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-3 mb-3">
                          <p className="text-gray-600 font-light tracking-widest">
                            {formatPrice(item.price)}
                          </p>
                          {item.originalPrice > item.price && (
                            <>
                              <p className="text-gray-400 text-sm font-light line-through">
                                {formatPrice(item.originalPrice)}
                              </p>
                              <span className="text-red-600 text-sm font-light">
                                Save {formatPrice(item.originalPrice - item.price)}
                              </span>
                            </>
                          )}
                        </div>

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

                        <div className="text-sm">
                          {item.isInStock ? (
                            <span className="text-green-600 font-light">
                              In Stock ({item.maxQuantity} available)
                            </span>
                          ) : (
                            <span className="text-red-600 font-light">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="px-3 py-2 text-gray-600 hover:text-black transition duration-300 disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 text-sm font-light tracking-widest min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxQuantity}
                            className="px-3 py-2 text-gray-600 hover:text-black transition duration-300 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm font-light tracking-widest uppercase text-gray-500 hover:text-black transition duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="sm:w-24 text-right">
                      <p className="text-lg font-light tracking-widest">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-sm font-light tracking-widest uppercase border-b border-black hover:opacity-70 transition duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 border border-gray-200 p-6">
                <h2 className="text-lg font-light tracking-widest uppercase mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-gray-600">Subtotal</span>
                    <span className="font-light">{formatPrice(getSubtotal())}</span>
                  </div>

                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-light text-gray-600">Discount</span>
                      <span className="font-light text-green-600">
                        -{formatPrice(getDiscount())}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="font-light text-gray-600">Shipping</span>
                    <span className="font-light text-green-600">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-light">Total</span>
                      <span className="font-light tracking-widest">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  
                  className="w-full bg-black text-white py-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300 mb-4"
                >
                  Proceed to Checkout
                </button>

                {!user && (
                  <p className="text-xs text-gray-500 text-center">
                    Please login to checkout
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
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