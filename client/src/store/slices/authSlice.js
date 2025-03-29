import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Load API URL from .env

// **Register User**
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data; // { success: true, message: "User registered successfully" }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

// **Login User**
export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("API_URL:", API_URL);
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    
    if (response.data.authentication) {
      localStorage.setItem("token", response.data.token); // Save token
    }
    
    return response.data; // { authentication: true, token: "JWT_TOKEN" }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// **Fetch User Details**
export const fetchUserDetails = createAsyncThunk("auth/getUser", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const authToken = state.auth.token || localStorage.getItem("token");

    if (!authToken) return rejectWithValue("No authentication token available");

    const response = await axios.get(`${API_URL}/api/auth/dashboard`, {
      headers: { "auth-token": authToken }, // Corrected header format
    });

    return response.data; // { name, email, etc. }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch user details");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null, // Persist token
    user: null,
    isAuthenticated: !!localStorage.getItem("token"), // Check authentication
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.authentication) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
