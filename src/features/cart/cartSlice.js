import { createSlice } from "@reduxjs/toolkit";

const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: cartFromStorage,
    totalItems: cartFromStorage.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: cartFromStorage.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
