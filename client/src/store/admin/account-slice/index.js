import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  isLoading: false,
  accountList: [],
  account: null,
};

const token = Cookies.get("token");

export const getAllAccount = createAsyncThunk(
  "/category/getAllAccount",
  async () => {
    if (token) {
      const result = await axios.get(
        "https://localhost:44304/api/Admin/AdminAccount/GetAllAccount",
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

export const getAccountById = createAsyncThunk(
  "/category/getAccountById",
  async (id) => {
    if (token) {
      const result = await axios.get(
        `https://localhost:44304/api/Admin/AdminAccount/GetAccountById?id=${id}`,
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

const adminAccountSlice = createSlice({
  name: "adminAccount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountList = action.payload.$values;
      })
      .addCase(getAllAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.accountList = [];
      })
      .addCase(getAccountById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAccountById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.account = action.payload;
      })
      .addCase(getAccountById.rejected, (state, action) => {
        state.isLoading = false;
        state.account = null;
      });
  },
});

export default adminAccountSlice.reducer;
