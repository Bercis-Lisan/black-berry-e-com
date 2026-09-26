import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const STORAGE_KEY = "blackberry_cart_v1";

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      // storage unavailable (private mode, quota, etc.) — fail silently
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!user) {
      window.alert("Please login first to add items to your cart.");
      return false;
    }
    const productId = product?.id || product?._id;
    if (!productId) return false;
    const productToAdd = { ...product, id: productId };
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      }
      return [...prev, { ...productToAdd, quantity }];
    });
    setLastAdded({ id: productId, name: product.name, at: Date.now() });
    return true;
  }, [user]);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQty = useCallback((id, quantity) => {
    setCartItems((prev) => {
      if (quantity < 1) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      subtotal,
      lastAdded,
    }),
    [cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, subtotal, lastAdded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
