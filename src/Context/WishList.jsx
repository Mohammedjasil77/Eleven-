import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../Api/Apipage";
import { AuthContext } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id;

  // ✅ Fetch Wishlist Data
  useEffect(() => {
    const fetchWishlistData = async () => {
      if (!currentUserId) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: userData } = await api.get(`/users/${currentUserId}`);

        if (!userData.wishlist || userData.wishlist.length === 0) {
          setWishlistItems([]);
          return;
        }

        const { data: productsData } = await api.get("/products");

        const mergedWishlistItems = userData.wishlist
          .map((wishlistItem) => {
            const product = productsData.find(
              (p) => p.id === wishlistItem.productId
            );
            if (!product) {
              console.warn(`Product ${wishlistItem.productId} not found in wishlist`);
              return null;
            }

            return {
              id: wishlistItem.id,
              productId: wishlistItem.productId,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images?.[0] || "/placeholder-image.jpg",
              size: wishlistItem.size,
              color: wishlistItem.color,
              category: product.category,
              isInStock: product.count > 0,
              maxQuantity: product.count,
              addedAt: wishlistItem.addedAt || new Date().toISOString(),
            };
          })
          .filter(Boolean);

        setWishlistItems(mergedWishlistItems);
      } catch (error) {
        console.error("❌ Error fetching wishlist data:", error);
        setError("Failed to load wishlist items");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [currentUserId]);

  // ✅ Add to Wishlist
  const addToWishlist = async (product, selectedSize = "M", selectedColor = "Default") => {
    if (!currentUserId) {
      setError("Please login to add items to wishlist");
      return false;
    }

    try {
      setError(null);

      const { data: userData } = await api.get(`/users/${currentUserId}`);

      // Check if item already exists in wishlist
      const existingItem = userData.wishlist?.find(
        (item) =>
          item.productId === product.id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingItem) {
        setError("Item is already in your wishlist");
        return false;
      }

      const newWishlistItem = {
        id: Date.now().toString(),
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
        addedAt: new Date().toISOString(),
      };

      const updatedWishlist = [...(userData.wishlist || []), newWishlistItem];

      await api.patch(`/users/${currentUserId}`, { wishlist: updatedWishlist });

      // Update local state
      const newItem = {
        ...newWishlistItem,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || "/placeholder-image.jpg",
        category: product.category,
        isInStock: product.count > 0,
        maxQuantity: product.count,
      };

      setWishlistItems(prev => [...prev, newItem]);
      return true;
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
      setError("Failed to add item to wishlist");
      return false;
    }
  };

  // ✅ Remove from Wishlist
  const removeFromWishlist = async (itemId) => {
    if (!currentUserId) {
      setError("Please login to manage wishlist");
      return false;
    }

    try {
      setError(null);

      setWishlistItems(prev => prev.filter(item => item.id !== itemId));

      const { data: userData } = await api.get(`/users/${currentUserId}`);
      const updatedWishlist = (userData.wishlist || []).filter(item => item.id !== itemId);

      await api.patch(`/users/${currentUserId}`, { wishlist: updatedWishlist });
      return true;
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
      setError("Failed to remove item from wishlist");
      
      // Revert optimistic update
      const { data: userData } = await api.get(`/users/${currentUserId}`);
      const { data: products } = await api.get("/products");
      
      const mergedWishlist = (userData.wishlist || [])
        .map(wishlistItem => {
          const product = products.find(p => p.id === wishlistItem.productId);
          return product ? { ...wishlistItem, ...product } : null;
        })
        .filter(Boolean);
      
      setWishlistItems(mergedWishlist);
      return false;
    }
  };

  // ✅ FIXED: Toggle Wishlist Function
  const toggleWishlist = async (product, selectedSize = "M", selectedColor = "Default") => {
    if (!currentUserId) {
      setError("Please login to manage wishlist");
      return { success: false, message: "Please login to manage wishlist" };
    }

    try {
      setError(null);
      
      // First, check if the product is already in wishlist
      const existingItem = wishlistItems.find(item => 
        item.productId === product.id && 
        item.size === selectedSize && 
        item.color === selectedColor
      );

      console.log("Toggle wishlist - Product ID:", product.id);
      console.log("Existing item:", existingItem);

      if (existingItem) {
        // If it exists, remove it using the wishlist item ID
        const success = await removeFromWishlist(existingItem.id);
        if (success) {
          return { success: true, message: "Product removed from wishlist", action: "removed" };
        } else {
          return { success: false, message: "Failed to remove product from wishlist" };
        }
      } else {
        // If it doesn't exist, add it
        const success = await addToWishlist(product, selectedSize, selectedColor);
        if (success) {
          return { success: true, message: "Product added to wishlist", action: "added" };
        } else {
          return { success: false, message: "Failed to add product to wishlist" };
        }
      }
    } catch (error) {
      console.error("❌ Error toggling wishlist:", error);
      setError("Failed to toggle wishlist");
      return { success: false, message: "Failed to toggle wishlist" };
    }
  };

  // ✅ Check if product is in wishlist (FIXED)
  const isInWishlist = (productId, size = "M", color = "Default") => {
    return wishlistItems.some(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );
  };

 // ✅ Move to Cart (remove from wishlist and add to cart) 
const moveToCart = async (wishlistItem, { addToCart }) => {
  try {
    setError(null);
    console.log('Moving to cart:', wishlistItem);

    // Call addToCart with the correct parameters
    const result = await addToCart(
      wishlistItem.productId, // productId
      wishlistItem.size || "M", // size
      wishlistItem.color || "Default", // color
      1 // quantity
    );

    console.log('Add to cart result:', result);

    if (result && result.success) {
      // Remove from wishlist after successful add to cart
      await removeFromWishlist(wishlistItem.id);
      return { success: true, message: "Item moved to cart successfully" };
    } else {
      return { 
        success: false, 
        message: result?.message || "Failed to add item to cart" 
      };
    }
  } catch (error) {
    console.error("❌ Error moving item to cart:", error);
    setError("Failed to move item to cart");
    return { success: false, message: "Failed to move item to cart" };
  }
};

  // ✅ Clear entire wishlist
  const clearWishlist = async () => {
    try {
      setWishlistItems([]);
      await api.patch(`/users/${currentUserId}`, { wishlist: [] });
    } catch (error) {
      console.error("❌ Error clearing wishlist:", error);
      setError("Failed to clear wishlist");
    }
  };

  // ✅ Clear error
  const clearError = () => setError(null);

  // ✅ Get wishlist count
  const getWishlistCount = () => wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveToCart,
        isInWishlist,
        clearWishlist,
        clearError,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};