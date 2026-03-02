import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const defaultFilters = {
  search: "",
  categories: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  rating: "",
  inStock: false,
  sort: "newest",
};

const getMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const buildQueryParams = (state) => {
  const { filters, pagination } = state.products;
  const params = {
    page: pagination.page,
    limit: pagination.limit,
    sort: filters.sort,
  };

  if (filters.search) params.search = filters.search;
  if (filters.categories.length) params.category = filters.categories.join(",");
  if (filters.brands.length) params.brand = filters.brands.join(",");
  if (filters.minPrice !== "") params.minPrice = filters.minPrice;
  if (filters.maxPrice !== "") params.maxPrice = filters.maxPrice;
  if (filters.rating !== "") params.rating = filters.rating;
  if (filters.inStock) params.inStock = true;

  return params;
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const params = buildQueryParams(getState());
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(getMessage(error, "Failed to fetch products."));
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 9,
      totalPages: 1,
      totalCount: 0,
    },
    availableFilters: {
      categories: [],
      brands: [],
    },
    filters: defaultFilters,
  },
  reducers: {
    setSearch(state, action) {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    toggleCategory(state, action) {
      const category = action.payload;
      const exists = state.filters.categories.includes(category);
      state.filters.categories = exists
        ? state.filters.categories.filter((item) => item !== category)
        : [...state.filters.categories, category];
      state.pagination.page = 1;
    },
    toggleBrand(state, action) {
      const brand = action.payload;
      const exists = state.filters.brands.includes(brand);
      state.filters.brands = exists
        ? state.filters.brands.filter((item) => item !== brand)
        : [...state.filters.brands, brand];
      state.pagination.page = 1;
    },
    setPriceRange(state, action) {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.pagination.page = 1;
    },
    setRating(state, action) {
      state.filters.rating = action.payload;
      state.pagination.page = 1;
    },
    setInStock(state, action) {
      state.filters.inStock = action.payload;
      state.pagination.page = 1;
    },
    setSort(state, action) {
      state.filters.sort = action.payload;
      state.pagination.page = 1;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
    clearFilters(state) {
      state.filters = { ...defaultFilters };
      state.pagination.page = 1;
    },
    clearProductsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
        state.availableFilters = action.payload.filters || state.availableFilters;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  toggleCategory,
  toggleBrand,
  setPriceRange,
  setRating,
  setInStock,
  setSort,
  setPage,
  clearFilters,
  clearProductsError,
} = productSlice.actions;

export default productSlice.reducer;
