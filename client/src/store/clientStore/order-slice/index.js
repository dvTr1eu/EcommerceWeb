import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  urlPayment: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: [],
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      "https://localhost:44304/api/Order/CreateNewOrder",
      orderData
    );

    return response.data;
  }
);

export const getAllOrdersByCustomerId = createAsyncThunk(
  "/order/getAllOrdersByCustomerId",
  async (customerId) => {
    const response = await axios.get(
      `https://localhost:44304/api/Order/GetOrdersByCustomerId/?customerId=${customerId}`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (orderId) => {
    const response = await axios.get(
      `https://localhost:44304/api/OrderDetails/GetOrderDetailsByOrderId?orderId=${orderId}`
    );

    return response.data;
  }
);

const shopOrderSlice = createSlice({
  name: "shopOrderSlice",
  initialState,
  reducer: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        console.log(action.payload);

        state.isLoading = false;
        state.urlPayment = action.payload.urlPayment;
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.urlPayment = null;
      })
      .addCase(getAllOrdersByCustomerId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByCustomerId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getAllOrdersByCustomerId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shopOrderSlice.actions;

export default shopOrderSlice.reducer;
