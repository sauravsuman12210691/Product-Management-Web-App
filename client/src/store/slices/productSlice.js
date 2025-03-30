import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Load API URL from .env

// **Create Product**
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const authToken = state.auth.token || localStorage.getItem("token");

      if (!authToken) return rejectWithValue("Authentication token is missing");

      const response = await axios.post(`${API_URL}/api/products`, productData, {
        headers: { "auth-token": authToken, "Content-Type":"application/json" },
      });

      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  }
);

// **Fetch Products**
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async ({ category, minPrice } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const authToken = state.auth.token || localStorage.getItem("token");

      if (!authToken) return rejectWithValue("Authentication token is missing");

      const response = await axios.get(`${API_URL}/api/products`, {
        params: {
          category: category || "",
          minPrice: minPrice || "",
        },
        headers: { "auth-token": authToken },
      });

      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// **Update Product**
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ productId, updatedData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const authToken = state.auth.token || localStorage.getItem("token");

      if (!authToken) return rejectWithValue("Authentication token is missing");

      const response = await axios.put(`${API_URL}/api/products/${productId}`, updatedData, {
        headers: { "auth-token": authToken, "Content-Type": "application/json" },
      });

      console.log("Update Response:", response.data); // Debugging log

      return response.data.product; // Ensure response contains { product: { _id, name, ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);


// **Delete Product**
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const authToken = state.auth.token || localStorage.getItem("token");

      if (!authToken) return rejectWithValue("Authentication token is missing");

      await axios.delete(`${API_URL}/api/products/${productId}`, {
        headers: { "auth-token": authToken },
      });

      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        if (!updatedProduct || !updatedProduct._id) return; // Prevent undefined error
      
        const index = state.items.findIndex((item) => item._id === updatedProduct._id);
        if (index !== -1) {
          state.items[index] = updatedProduct; // Correctly update the product
        }
      })
      
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product._id !== action.payload);
      });
  },
});

export default productSlice.reducer;
