import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCart = () => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Error loading cart from localStorage", err);
    return [];
  }
};

const initialState = {
  cart: loadCart(),
};

export const cartSlice = createSlice({
  name: "cart", // changed from "product" → clearer
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price } = action.payload;
      const exists = state.cart.find((item) => item.id === id);

      if (exists) {
        exists.quantity += 1;
      } else {
        state.cart.push({ id, name, price, quantity: 1 });
      }

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter((item) => item.id !== id);

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.setItem("cart", JSON.stringify([]));
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
