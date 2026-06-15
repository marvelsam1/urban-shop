import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import Modal from "./components/Modal";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  // Fetch cart items when the user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("user_id", user.id);

    if (!error && data) setCartItems(data);
    setLoading(false);
  };

  const addToCart = async (productId) => {
    if (!user) {
      setModalConfig({
        isOpen: true,
        type: "info",
        title: "Sign In Required",
        message:
          "Please sign in or create an account to add items to your cart.",
      });
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.product_id === productId,
    );

    if (existingItem) {
      // Update quantity if already in cart
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);

      if (!error) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
        setModalConfig({
          isOpen: true,
          type: "success",
          title: "Added to Cart",
          message: "Item quantity updated in your cart.",
        });
      } else {
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Failed to Update Cart",
          message: error.message,
        });
      }
    } else {
      // Insert new cart item
      const { data, error } = await supabase
        .from("cart_items")
        .insert([{ user_id: user.id, product_id: productId, quantity: 1 }])
        .select("*, products(*)")
        .single();

      if (!error && data) {
        setCartItems((prev) => [...prev, data]);
        setModalConfig({
          isOpen: true,
          type: "success",
          title: "Added to Cart",
          message: "Item successfully added to your cart.",
        });
      } else {
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Failed to Add to Cart",
          message: error?.message || "An unexpected error occurred.",
        });
      }
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", cartItemId);

    if (!error) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const removeFromCart = async (cartItemId) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);
    if (!error) {
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    }
  };

  const clearCart = async () => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);
    if (!error) setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.products.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        loading,
      }}
    >
      {children}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type || "info"}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
