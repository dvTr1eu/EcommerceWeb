import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/review/addProductReview",
  async (formData) => {
    const response = await axios.post(
      `https://localhost:44304/api/ProductReview/AddProductReview`,
      formData
    );
    console.log(response.data);

    return response.data;
  }
);

export const getReview = createAsyncThunk(
  "/review/getProductReview",
  async (id) => {
    const response = await axios.get(
      `https://localhost:44304/api/ProductReview/GetAllProductReview?productId=${id}`
    );
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.listReview;
      })
      .addCase(getReview.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
