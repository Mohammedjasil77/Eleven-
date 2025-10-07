// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useCart } from "../../../Context/CartContext";
// import { useAuth } from "../../../Context/AuthContext"

// const CheckoutPage = () => {
//   const { cartItems, getCartTotal, getCartCount, clearCart, updateCartItemQuantity, removeFromCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);
//   const [orderDetails, setOrderDetails] = useState(null);

//   // Form states
//   const [shippingInfo, setShippingInfo] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "India"
//   });

//   const [paymentInfo, setPaymentInfo] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     nameOnCard: "",
//     saveCard: false
//   });

//   const [shippingMethod, setShippingMethod] = useState("standard");
//   const [orderNotes, setOrderNotes] = useState("");

//   const shippingMethods = [
//     {
//       id: "standard",
//       name: "Standard Shipping",
//       price: 0,
//       delivery: "5-7 business days"
//     },
//     {
//       id: "express",
//       name: "Express Shipping",
//       price: 500,
//       delivery: "2-3 business days"
//     },
//     {
//       id: "nextday",
//       name: "Next Day Delivery",
//       price: 1000,
//       delivery: "Next business day"
//     }
//   ];

//   useEffect(() => {
//     // Redirect if cart is empty
//     if (cartItems.length === 0 && !orderSuccess) {
//       navigate("/cart");
//     }

//     // Pre-fill user info if available
//     if (user) {
//       setShippingInfo(prev => ({
//         ...prev,
//         email: user.email || "",
//         firstName: user.name?.split(' ')[0] || "",
//         lastName: user.name?.split(' ')[1] || ""
//       }));
//     }
//   }, [cartItems, user, navigate, orderSuccess]);

//   const handleShippingInfoChange = (e) => {
//     const { name, value } = e.target;
//     setShippingInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePaymentInfoChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setPaymentInfo(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     const matches = v.match(/\d{4,16}/g);
//     const match = matches && matches[0] || '';
//     const parts = [];
    
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
    
//     return parts.length ? parts.join(' ') : value;
//   };

//   const formatExpiryDate = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     if (v.length >= 2) {
//       return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
//     }
//     return value;
//   };

//   const handleCardNumberChange = (e) => {
//     const formatted = formatCardNumber(e.target.value);
//     setPaymentInfo(prev => ({
//       ...prev,
//       cardNumber: formatted
//     }));
//   };

//   const handleExpiryDateChange = (e) => {
//     const formatted = formatExpiryDate(e.target.value);
//     setPaymentInfo(prev => ({
//       ...prev,
//       expiryDate: formatted
//     }));
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const calculateShipping = () => {
//     const method = shippingMethods.find(m => m.id === shippingMethod);
//     return method ? method.price : 0;
//   };

//   const calculateTax = () => {
//     return calculateSubtotal() * 0.18; // 18% GST
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateShipping() + calculateTax();
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'
//     ];
    
//     for (let field of requiredFields) {
//       if (!shippingInfo[field].trim()) {
//         alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     if (!paymentInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
//       alert("Please enter a valid 16-digit card number");
//       return false;
//     }

//     if (!paymentInfo.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
//       alert("Please enter a valid expiry date (MM/YY)");
//       return false;
//     }

//     if (!paymentInfo.cvv.match(/^\d{3,4}$/)) {
//       alert("Please enter a valid CVV");
//       return false;
//     }

//     if (!paymentInfo.nameOnCard.trim()) {
//       alert("Please enter name on card");
//       return false;
//     }

//     return true;
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       const order = {
//         id: `ORD${Date.now()}`,
//         date: new Date().toISOString(),
//         items: cartItems,
//         shippingInfo,
//         paymentInfo: {
//           ...paymentInfo,
//           cardNumber: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`
//         },
//         shippingMethod: shippingMethods.find(m => m.id === shippingMethod),
//         subtotal: calculateSubtotal(),
//         shipping: calculateShipping(),
//         tax: calculateTax(),
//         total: calculateTotal(),
//         status: 'confirmed'
//       };

//       setOrderDetails(order);
//       setOrderSuccess(true);
//       clearCart();

//       // In a real app, you would send this to your backend
//       console.log('Order placed:', order);

//     } catch (error) {
//       alert("There was an error processing your order. Please try again.");
//       console.error("Order error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuantityChange = (itemId, newQuantity) => {
//     if (newQuantity < 1) return;
//     updateCartItemQuantity(itemId, newQuantity);
//   };

//   const handleRemoveItem = (itemId) => {
//     removeFromCart(itemId);
//   };

//   if (orderSuccess && orderDetails) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-20">
//         <div className="max-w-4xl mx-auto px-6 py-12">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
            
//             <h1 className="text-3xl font-serif font-light mb-4">Order Confirmed!</h1>
//             <p className="text-gray-600 mb-2">Thank you for your purchase, {shippingInfo.firstName}!</p>
//             <p className="text-gray-600 mb-6">Your order <strong>{orderDetails.id}</strong> has been confirmed.</p>
            
//             <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
//               <h3 className="font-semibold mb-4">Order Summary</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Items:</span>
//                   <span>{getCartCount()} items</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Total:</span>
//                   <span className="font-semibold">
//                     {new Intl.NumberFormat('en-IN', {
//                       style: 'currency',
//                       currency: 'INR',
//                       maximumFractionDigits: 0
//                     }).format(orderDetails.total)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping to:</span>
//                   <span className="text-right">
//                     {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link
//                 to="/shop"
//                 className="bg-black text-white px-8 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
//               >
//                 Continue Shopping
//               </Link>
//               <button
//                 onClick={() => window.print()}
//                 className="border border-black text-black px-8 py-3 text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition duration-300"
//               >
//                 Print Receipt
//               </button>
//             </div>

//             <p className="text-gray-500 text-sm mt-8">
//               A confirmation email has been sent to {shippingInfo.email}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
//           <Link
//             to="/shop"
//             className="bg-black text-white px-6 py-3 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Column - Forms */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
//               <h2 className="text-2xl font-serif font-light mb-6">Shipping Information</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">First Name *</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={shippingInfo.firstName}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">Last Name *</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={shippingInfo.lastName}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={shippingInfo.email}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">Phone *</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={shippingInfo.phone}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">Address *</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={shippingInfo.address}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">City *</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={shippingInfo.city}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">State *</label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={shippingInfo.state}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">ZIP Code *</label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={shippingInfo.zipCode}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">Country</label>
//                   <input
//                     type="text"
//                     name="country"
//                     value={shippingInfo.country}
//                     onChange={handleShippingInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300 bg-gray-50"
//                     disabled
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Method */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
//               <h2 className="text-2xl font-serif font-light mb-6">Shipping Method</h2>
              
//               <div className="space-y-4">
//                 {shippingMethods.map((method) => (
//                   <label key={method.id} className="flex items-center justify-between p-4 border border-gray-200 hover:border-black transition duration-300 cursor-pointer">
//                     <div className="flex items-center space-x-4">
//                       <input
//                         type="radio"
//                         name="shippingMethod"
//                         value={method.id}
//                         checked={shippingMethod === method.id}
//                         onChange={(e) => setShippingMethod(e.target.value)}
//                         className="text-black focus:ring-black"
//                       />
//                       <div>
//                         <div className="font-medium">{method.name}</div>
//                         <div className="text-sm text-gray-500">{method.delivery}</div>
//                       </div>
//                     </div>
//                     <div className="font-medium">
//                       {method.price === 0 ? 'FREE' : new Intl.NumberFormat('en-IN', {
//                         style: 'currency',
//                         currency: 'INR',
//                         maximumFractionDigits: 0
//                       }).format(method.price)}
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Payment Information */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
//               <h2 className="text-2xl font-serif font-light mb-6">Payment Information</h2>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">Card Number *</label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={paymentInfo.cardNumber}
//                     onChange={handleCardNumberChange}
//                     placeholder="1234 5678 9012 3456"
//                     maxLength="19"
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-light tracking-widest uppercase mb-2">Expiry Date *</label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={paymentInfo.expiryDate}
//                       onChange={handleExpiryDateChange}
//                       placeholder="MM/YY"
//                       maxLength="5"
//                       className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-light tracking-widest uppercase mb-2">CVV *</label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={paymentInfo.cvv}
//                       onChange={handlePaymentInfoChange}
//                       placeholder="123"
//                       maxLength="4"
//                       className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-light tracking-widest uppercase mb-2">Name on Card *</label>
//                   <input
//                     type="text"
//                     name="nameOnCard"
//                     value={paymentInfo.nameOnCard}
//                     onChange={handlePaymentInfoChange}
//                     className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300"
//                     required
//                   />
//                 </div>
                
//                 <label className="flex items-center space-x-3">
//                   <input
//                     type="checkbox"
//                     name="saveCard"
//                     checked={paymentInfo.saveCard}
//                     onChange={handlePaymentInfoChange}
//                     className="text-black focus:ring-black"
//                   />
//                   <span className="text-sm">Save card for future purchases</span>
//                 </label>
//               </div>
//             </div>

//             {/* Order Notes */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//               <h2 className="text-2xl font-serif font-light mb-6">Order Notes (Optional)</h2>
//               <textarea
//                 value={orderNotes}
//                 onChange={(e) => setOrderNotes(e.target.value)}
//                 placeholder="Any special instructions for your order..."
//                 className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition duration-300 h-32 resize-none"
//               />
//             </div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sticky top-32">
//               <h2 className="text-2xl font-serif font-light mb-6">Order Summary</h2>
              
//               {/* Cart Items */}
//               <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100">
//                     <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
//                       <img
//                         src={item.images?.[0] || "/placeholder-image.jpg"}
//                         alt={item.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-sm font-light truncate">{item.name}</h3>
//                       <p className="text-xs text-gray-500">
//                         Size: {item.size} | Color: {item.color}
//                       </p>
//                       <div className="flex items-center justify-between mt-2">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                             className="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50"
//                           >
//                             -
//                           </button>
//                           <span className="text-sm w-8 text-center">{item.quantity}</span>
//                           <button
//                             onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                             className="w-6 h-6 border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50"
//                           >
//                             +
//                           </button>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveItem(item.id)}
//                           className="text-red-600 text-xs hover:text-red-800"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="text-right">
//                       <p className="text-sm font-light">
//                         {new Intl.NumberFormat('en-IN', {
//                           style: 'currency',
//                           currency: 'INR',
//                           maximumFractionDigits: 0
//                         }).format(item.price * item.quantity)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Order Totals */}
//               <div className="space-y-3 border-t border-gray-200 pt-6">
//                 <div className="flex justify-between text-sm">
//                   <span>Subtotal</span>
//                   <span>
//                     {new Intl.NumberFormat('en-IN', {
//                       style: 'currency',
//                       currency: 'INR',
//                       maximumFractionDigits: 0
//                     }).format(calculateSubtotal())}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between text-sm">
//                   <span>Shipping</span>
//                   <span>
//                     {calculateShipping() === 0 ? 'FREE' : new Intl.NumberFormat('en-IN', {
//                       style: 'currency',
//                       currency: 'INR',
//                       maximumFractionDigits: 0
//                     }).format(calculateShipping())}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between text-sm">
//                   <span>Tax (18% GST)</span>
//                   <span>
//                     {new Intl.NumberFormat('en-IN', {
//                       style: 'currency',
//                       currency: 'INR',
//                       maximumFractionDigits: 0
//                     }).format(calculateTax())}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
//                   <span>Total</span>
//                   <span>
//                     {new Intl.NumberFormat('en-IN', {
//                       style: 'currency',
//                       currency: 'INR',
//                       maximumFractionDigits: 0
//                     }).format(calculateTotal())}
//                   </span>
//                 </div>
//               </div>

//               {/* Place Order Button */}
//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={loading}
//                 className={`w-full py-4 text-sm font-light tracking-widest uppercase mt-6 transition duration-300 ${
//                   loading
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-black text-white hover:bg-gray-800'
//                 }`}
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Processing...
//                   </div>
//                 ) : (
//                   `Place Order • ${new Intl.NumberFormat('en-IN', {
//                     style: 'currency',
//                     currency: 'INR',
//                     maximumFractionDigits: 0
//                   }).format(calculateTotal())}`
//                 )}
//               </button>

//               <p className="text-xs text-gray-500 text-center mt-4">
//                 By placing your order, you agree to our Terms of Service and Privacy Policy
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;