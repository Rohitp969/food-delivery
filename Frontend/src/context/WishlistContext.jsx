import React, { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add item (only if not already present)
  const addToWishlist = (food) => {
    setWishlist((prev) => {
      if (prev.some((item) => item._id === food._id)) return prev;
      return [...prev, food];
    });
  };

  // Remove item by id
  const removeFromWishlist = (foodId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== foodId));
  };

  // Check if item exists
  const isInWishlist = (foodId) => {
    return wishlist.some((item) => item._id === foodId);
  };

  // Clear all
  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
};