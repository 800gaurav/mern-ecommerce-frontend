import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const getMessage = (error, fallback) => {
  // Check for validation errors array
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map(err => err.msg || err.message).join(', ');
  }
  // Check for single message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  // Fallback
  return fallback;
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Registration failed."));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Login failed."));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to load profile."));
    }
  }
);

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");

const initialState = {
  token: tokenFromStorage || null,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  isAuthenticated: Boolean(tokenFromStorage),
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.successMessage = "Registration successful.";
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.successMessage = "Login successful.";
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { logout, clearAuthError, clearAuthMessage } = authSlice.actions;

export default authSlice.reducer;
