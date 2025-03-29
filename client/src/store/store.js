import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice"; // Import the auth reducer

const store = configureStore({
  reducer: {
    products: productReducer, // Manages product-related state
    auth: authReducer, // Manages authentication state
  },
});

export default store;
