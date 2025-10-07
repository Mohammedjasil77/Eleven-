import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../Api/Apipage";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const {user}=useContext(AuthContext)
  const currentUserId =  user?.id

  // ✅ Fetch Cart Data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: userData } = await api.get(`/users/${currentUserId}`);

        if (!userData.cart || userData.cart.length === 0) {
          setCartItems([]);
          return;
        }

        const { data: productsData } = await api.get("/products");

        const mergedCartItems = userData.cart
          .map((cartItem) => {
            const product = productsData.find(
              (p) => p.id === cartItem.productId
            );
            if (!product) {
              console.warn(`Product ${cartItem.productId} not found`);
              return null;
            }

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
              isInStock: product.count > 0,
            };
          })
          .filter(Boolean);

        setCartItems(mergedCartItems);
      } catch (error) {
        console.error("❌ Error fetching cart data:", error);
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [currentUserId]);

  // ✅ Add to Cart - Fixed version
  const addToCart = async (productId, selectedSize = "M", selectedColor = "Default", quantity = 1) => {
    try {
      setError(null);

      // First, get the product details
      const { data: products } = await api.get("/products");
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        setError("Product not found");
        return { success: false, message: "Product not found" };
      }

      // Check stock availability
      if (product.count < 1) {
        setError("Product is out of stock");
        return { success: false, message: "Product is out of stock" };
      }

      const { data: userData } = await api.get(`/users/${currentUserId}`);

      const existingItem = userData.cart?.find(
        (item) =>
          item.productId === productId &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      let updatedCart;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.count) {
          setError(`Only ${product.count} items available in stock`);
          return { success: false, message: `Only ${product.count} items available in stock` };
        }

        updatedCart = userData.cart.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.count) {
          setError(`Only ${product.count} items available in stock`);
          return { success: false, message: `Only ${product.count} items available in stock` };
        }

        const newCartItem = {
          id: Date.now().toString(),
          productId: productId,
          size: selectedSize,
          color: selectedColor,
          quantity,
        };
        updatedCart = [...(userData.cart || []), newCartItem];
      }

      await api.patch(`/users/${currentUserId}`, { cart: updatedCart });

      // Update local state
      const { data: refreshedUser } = await api.get(`/users/${currentUserId}`);
      const { data: allProducts } = await api.get("/products");

      const mergedCart = (refreshedUser.cart || [])
        .map((cartItem) => {
          const product = allProducts.find((p) => p.id === cartItem.productId);
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
            isInStock: product.count > 0,
          };
        })
        .filter(Boolean);

      setCartItems(mergedCart);
      return { success: true, message: "Product added to cart successfully" };
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      setError("Failed to add product to cart");
      return { success: false, message: "Failed to add product to cart" };
    }
  };

  // ✅ Update Quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      setError(null);
      
      // Find the item to check stock
      const itemToUpdate = cartItems.find(item => item.id === itemId);
      if (!itemToUpdate) return;

      // Check stock limit
      if (newQuantity > itemToUpdate.maxQuantity) {
        setError(`Only ${itemToUpdate.maxQuantity} items available in stock`);
        return;
      }

      // Optimistic update
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      const { data: userData } = await api.get(`/users/${currentUserId}`);
      const updatedCart = userData.cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      await api.patch(`/users/${currentUserId}`, { cart: updatedCart });
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
      setError("Failed to update quantity");
    }
  };

  // ✅ Remove Item
  const removeItem = async (itemId) => {
    try {
      setError(null);

      // Optimistic update
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));

      const { data: userData } = await api.get(`/users/${currentUserId}`);
      const updatedCart = userData.cart.filter((item) => item.id !== itemId);

      await api.patch(`/users/${currentUserId}`, { cart: updatedCart });
    } catch (error) {
      console.error("❌ Error removing item:", error);
      setError("Failed to remove item from cart");
      
      // Revert optimistic update on error
      const { data: userData } = await api.get(`/users/${currentUserId}`);
      const { data: products } = await api.get("/products");
      
      const mergedCart = userData.cart
        .map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.productId);
          return product ? { ...cartItem, ...product } : null;
        })
        .filter(Boolean);
      
      setCartItems(mergedCart);
    }
  };

  // ✅ Clear error
  const clearError = () => setError(null);

  // ✅ Get cart count
  const getCartCount = () => 
    cartItems.reduce((total, item) => total + item.quantity, 0);

  // ✅ Check if item is in cart
  const isInCart = (productId, size = "M", color = "Default") => 
    cartItems.some(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );

  // ✅ Clear entire cart
  const clearCart = async () => {
    try {
      setCartItems([]);
      await api.patch(`/users/${currentUserId}`, { cart: [] });
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      setError("Failed to clear cart");
    }
  };

  // ✅ Totals
  const getSubtotal = () =>
    cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  const getDiscount = () =>
    cartItems.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price || 0;
      const currentPrice = item.price || 0;
      const diff = Math.max(0, originalPrice - currentPrice);
      return total + diff * (item.quantity || 0);
    }, 0);

  const getTotal = () => getSubtotal();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        clearError,
        getCartCount,
        isInCart,
        getSubtotal,
        getDiscount,
        getTotal,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};