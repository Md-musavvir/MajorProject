import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cart: [],
};
export const cartSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price } = action.payload;
      const exists = state.cart.find((item) => item.id === id);
      if (exists) {
        exists.quantity += 1;
      } else {
        const product = { name, id, price, quantity: 1 };

        state.cart.push(product);
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const index = state.cart.findIndex((item) => item.id === id);

      if (index !== -1) {
        state.cart.splice(index, 1);
      }
    },
  },
});
export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
