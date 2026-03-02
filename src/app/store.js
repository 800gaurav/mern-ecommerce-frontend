import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productsReducer from "../features/products/productSlice";
import adminReducer from "../features/admin/adminSlice";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    admin: adminReducer,
    cart: cartReducer,
  },
});
