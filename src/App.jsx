import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/NonAuth/Home/HomePage";
import Registration from "./Pages/Auth/Registration";
import Login from "./Pages/Auth/Login";
import NotFound from "./Pages/NonAuth/NotFound/NotFound";
import Navbar from "./Components/Navbar/Navbar";
import ShopPage from "./Pages/NonAuth/shop/Shop";
import NewArrivals from "./Pages/NonAuth/Home/NewArrivals";
import ProductDetails from "./Pages/NonAuth/Products/ProductDetails";
import CartPage from "./Pages/NonAuth/Cart/Cart";
import WishlistPage from "./Pages/NonAuth/Cart/wishlist";
import AboutPage from "./Pages/NonAuth/About";


function App() {
  return (
    
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/product-details" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
    </Routes>   
    </>
   
  );
}

export default App;
