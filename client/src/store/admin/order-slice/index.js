import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  adminOrderList: [],
  adminOrderDetails: null,
};

const token = Cookies.get("token");

export const getAllOrdersUser = createAsyncThunk(
  "/adminOrder/getAllOrdersUser",
  async () => {
    if (token) {
      const result = await axios.get(
        "https://localhost:44304/api/Admin/AdminOrders/GetAllOrderUser",
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;
    } else {
      console.log("Token not found");
    }
  }
);

export const getOrderById = createAsyncThunk(
  "/adminOrder/getOrderById",
  async (orderId) => {
    if (token) {
      const result = await axios.get(
        `https://localhost:44304/api/Admin/AdminOrders/GetOrderById?orderId=${orderId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;
    } else {
      console.log("Token not found");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/adminOrder/updateOrderStatus",
  async ({ orderId, statusId, isPaid, isDeleted, isHistory }) => {
    const result = await axios.put(
      `https://localhost:44304/api/Order/ChangeStatus?orderId=${orderId}&statusId=${statusId}&isPaid=${isPaid}&isDeleted=${isDeleted}&isHistory=${isHistory}`,
      {
        orderId,
        statusId,
        isPaid,
        isDeleted,
        isHistory,
      }
    );

    return result?.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.adminOrderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminOrderList = action.payload.$values;
      })
      .addCase(getAllOrdersUser.rejected, (state) => {
        state.isLoading = false;
        state.adminOrderList = [];
      })
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminOrderDetails = action.payload;
      })
      .addCase(getOrderById.rejected, (state) => {
        state.isLoading = false;
        state.adminOrderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
