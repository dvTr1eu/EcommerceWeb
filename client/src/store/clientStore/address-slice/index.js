import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:8088/v1/api/client/address/add",
      formData
    );
    return response.data;
  }
);

export const getAllAddress = createAsyncThunk(
  "/addresses/getAllAddress",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:8088/v1/api/client/address/get/${userId}`
    );
    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  "/addresses/editAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `http://localhost:8088/v1/api/client/address/update/${userId}/${addressId}`,
      formData
    );
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `http://localhost:8088/v1/api/client/address/delete/${userId}/${addressId}`
    );
    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(getAllAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
