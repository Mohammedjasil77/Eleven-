import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  ADD_TO_CART: 'ADD_TO_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case CART_ACTIONS.SET_CART_ITEMS:
      return { 
        ...state, 
        cartItems: action.payload, 
        loading: false,
        error: null 
      };

    case CART_ACTIONS.ADD_TO_CART:
      const existingItem = state.cartItems.find(
        item => item.productId === action.payload.productId && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      );

      if (existingItem) {
        // Update quantity if item already exists
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        // Add new item
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload]
        };
      }

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CART_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cartItems: []
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  cartCount: 0,
  cartTotal: 0
};

// Cart Provider Component
export const CartProvider = ({ children, currentUserId = "1" }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate derived values
  useEffect(() => {
    const cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    dispatch({
      type: CART_ACTIONS.SET_CART_ITEMS,
      payload: state.cartItems.map(item => ({
        ...item,
        // Ensure price is included for calculations
        price: item.price || 0
      }))
    });
  }, [state.cartItems]);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`);
      const userData = await userResponse.json();
      
      if (userData.cart && userData.cart.length > 0) {
        // Fetch product details for cart items
        const productsResponse = await fetch('http://localhost:3001/products');
        const productsData = await productsResponse.json();
        
        const cartItemsWithDetails = userData.cart.map(cartItem => {
          const product = productsData.find(p => p.id === cartItem.productId);
          return product ? {
            ...cartItem,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            category: product.category,
            maxQuantity: product.count,
            isInStock: product.count > 0
          } : null;
        }).filter(item => item !== null);
        
        dispatch({ type: CART_ACTIONS.SET_CART_ITEMS, payload: cartItemsWithDetails });
      } else {
        dispatch({ type: CART_ACTIONS.SET_CART_ITEMS, payload: [] });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load cart' });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      // Fetch product details
      const productsResponse = await fetch('http://localhost:3001/products');
      const productsData = await productsResponse.json();
      const product = productsData.find(p => p.id === productId);

      if (!product) {
        throw new Error('Product not found');
      }

      // Fetch current user data
      const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`);
      const userData = await userResponse.json();

      const selectedSize = size || product.sizes[0];
      const selectedColor = color || product.colors[0];

      const newCartItem = {
        id: `cart_${Date.now()}`,
        productId: productId,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
        addedAt: new Date().toISOString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        maxQuantity: product.count,
        isInStock: product.count > 0
      };

      // Update local state optimistically
      dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: newCartItem });

      // Update backend
      const existingCartItem = userData.cart?.find(
        item => item.productId === productId && 
                item.size === selectedSize && 
                item.color === selectedColor
      );

      let updatedCart;
      if (existingCartItem) {
        updatedCart = userData.cart.map(item =>
          item.id === existingCartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...(userData.cart || []), {
          id: newCartItem.id,
          productId: newCartItem.productId,
          quantity: newCartItem.quantity,
          size: newCartItem.size,
          color: newCartItem.color,
          addedAt: newCartItem.addedAt
        }];
      }

      await fetch(`http://localhost:3001/users/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        })
      });

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return { success: true, message: `${product.name} added to cart!` };
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to add item to cart' });
      // Re-fetch cart to revert optimistic update
      await fetchCart();
      return { success: false, message: 'Failed to add item to cart' };
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Optimistic update
      dispatch({ 
        type: CART_ACTIONS.UPDATE_QUANTITY, 
        payload: { itemId, quantity: newQuantity } 
      });

      // Update backend
      const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`);
      const userData = await userResponse.json();
      
      const updatedCart = userData.cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      await fetch(`http://localhost:3001/users/${currentUserId}`, {
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
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to update quantity' });
      await fetchCart(); // Revert on error
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      // Optimistic update
      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: itemId });

      // Update backend
      const userResponse = await fetch(`http://localhost:3001/users/${currentUserId}`);
      const userData = await userResponse.json();
      
      const updatedCart = userData.cart.filter(item => item.id !== itemId);

      await fetch(`http://localhost:3001/users/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        })
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to remove item from cart' });
      await fetchCart(); // Revert on error
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });

      // Update backend
      await fetch(`http://localhost:3001/users/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: []
        })
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to clear cart' });
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = state.cartItems.reduce((total, item) => {
      const originalTotal = item.originalPrice * item.quantity;
      const currentTotal = item.price * item.quantity;
      return total + (originalTotal - currentTotal);
    }, 0);
    const total = subtotal;

    return {
      subtotal,
      discount,
      total,
      itemCount: state.cartItems.reduce((count, item) => count + item.quantity, 0)
    };
  };

  // Check if product is in cart
  const isInCart = (productId, size = null, color = null) => {
    return state.cartItems.some(item => 
      item.productId === productId &&
      (!size || item.size === size) &&
      (!color || item.color === color)
    );
  };

  // Value to be provided by context
  const value = {
    // State
    cartItems: state.cartItems,
    loading: state.loading,
    error: state.error,
    
    // Computed values
    cartCount: state.cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: getCartTotals().total,
    
    // Actions
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;