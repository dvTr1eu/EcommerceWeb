import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productHomeList: [],
  productDetails: null,
  productSearchList: [],
  totalItems: null,
};

export const getByCondition = createAsyncThunk(
  "/product/getByCondition",
  async ({ categoryId, sortOrder, pageNumber, pageSize }) => {
    let url = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    const result = await axios.get(
      `https://localhost:44304/api/UserProducts/GetByCondition${url}`
    );
    return result?.data;
  }
);

export const getBySearchCondition = createAsyncThunk(
  "/product/getBySearchCondition",
  async ({ searchKey, sortOrder, pageNumber, pageSize }) => {
    let url = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (searchKey != null) {
      url += `&searchKey=${searchKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    const result = await axios.get(
      `https://localhost:44304/api/UserProducts/FindBySearchKey${url}`
    );
    return result?.data;
  }
);

export const getProductHomeList = createAsyncThunk(
  "/product/getProductHomeList",
  async (id) => {
    const result = await axios.get(
      `https://localhost:44304/api/UserProducts/GetAllProduct`
    );
    return result?.data;
  }
);

export const getProductDetails = createAsyncThunk(
  "/product/getProductDetails",
  async (id) => {
    const result = await axios.get(
      `https://localhost:44304/api/UserProducts/GetById/?id=${id}`
    );
    return result?.data;
  }
);

const clientProductSlice = createSlice({
  name: "clientProduct",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    resetSearchResults: (state) => {
      state.productSearchList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getByCondition.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getByCondition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.products.$values;
        state.totalItems = action.payload?.totalItems;
      })
      .addCase(getByCondition.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(getProductHomeList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductHomeList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productHomeList = action.payload?.$values;
      })
      .addCase(getProductHomeList.rejected, (state, action) => {
        state.isLoading = false;
        state.productHomeList = [];
      })
      .addCase(getBySearchCondition.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBySearchCondition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productSearchList = action.payload?.$values;
      })
      .addCase(getBySearchCondition.rejected, (state, action) => {
        state.isLoading = false;
        state.productSearchList = [];
      })
      .addCase(getProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = [];
      });
  },
});

export const { setProductDetails } = clientProductSlice.actions;
export const { resetSearchResults } = clientProductSlice.actions;

export default clientProductSlice.reducer;
