import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const getMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors?.[0]?.message ||
  fallback;

// Products
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/admin/list", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to fetch admin products."));
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  "admin/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/products", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to create product."));
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to update product."));
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to delete product."));
    }
  }
);

// Users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to fetch users."));
    }
  }
);

export const toggleBlockUser = createAsyncThunk(
  "admin/toggleBlockUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${id}/toggle-block`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to update user."));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to delete user."));
    }
  }
);

// Orders
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/orders");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to fetch orders."));
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to update order."));
    }
  }
);

// Categories
export const fetchAllCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to fetch categories."));
    }
  }
);

export const createCategory = createAsyncThunk(
  "admin/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/categories", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to create category."));
    }
  }
);

export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/categories/${id}`, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to update category."));
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to delete category."));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    items: [],
    users: [],
    orders: [],
    categories: [],
    loading: false,
    formLoading: false,
    error: null,
    successMessage: null,
    pagination: {
      page: 1,
      limit: 25,
      totalPages: 1,
      totalCount: 0,
    },
  },
  reducers: {
    clearAdminStatus(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminProduct.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.formLoading = false;
        state.items = [action.payload.data, ...state.items];
        state.successMessage = "Product created successfully.";
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.formLoading = false;
        const updated = action.payload.data;
        state.items = state.items.map((item) => (item._id === updated._id ? updated : item));
        state.successMessage = "Product updated successfully.";
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteAdminProduct.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.formLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.successMessage = "Product deleted successfully.";
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        state.successMessage = "User updated successfully.";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.successMessage = "User deleted successfully.";
      })
      // Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
        state.successMessage = "Order updated successfully.";
      })
      // Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.successMessage = "Category created successfully.";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
        state.successMessage = "Category updated successfully.";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
        state.successMessage = "Category deleted successfully.";
      });
  },
});

export const { clearAdminStatus } = adminSlice.actions;

export default adminSlice.reducer;
