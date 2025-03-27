import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  isLoading: false,
  orderListStatus: {},
  listInfoProduct: {},
};
const token = Cookies.get("token");

export const getOrderStatus = createAsyncThunk(
  "/home/getOrderStatus",
  async (date) => {
    if (token) {
      const result = await axios.get(
        `https://localhost:44304/api/Admin/AdminHome/GetTotalOrderStatusInDay?date=${date}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return result?.data;
    } else {
      console.log("Token not found");
    }
  }
);

export const getProductSold = createAsyncThunk(
  "/home/getProductSold",
  async (date) => {
    if (token) {
      const result = await axios.get(
        `https://localhost:44304/api/Admin/AdminHome/GetTotalProductSellInDay?date=${date}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return result?.data;
    } else {
      console.log("Token not found");
    }
  }
);

const adminHomeSlice = createSlice({
  name: "adminHome",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderListStatus = action.payload;
      })
      .addCase(getOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.orderListStatus = [];
      })
      .addCase(getProductSold.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductSold.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.listInfoProduct = action.payload;
      })
      .addCase(getProductSold.rejected, (state, action) => {
        state.isLoading = false;
        state.orderListStatus = [];
      });
  },
});

export default adminHomeSlice.reducer;
