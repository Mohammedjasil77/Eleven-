import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>  
  </AuthProvider>
  </BrowserRouter>
);
