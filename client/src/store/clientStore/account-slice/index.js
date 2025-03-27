import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  changePasswordResult: false,
};

export const changePassword = createAsyncThunk(
  "/account/changePassword",
  async (formData) => {
    const response = await axios.post(
      "https://localhost:44304/api/Auth/ChangePassword",
      formData
    );
    return response.data;
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.changePasswordResult = action.payload;
      })
      .addCase(changePassword.rejected, (state) => {
        state.isLoading = false;
        state.changePasswordResult = false;
      });
  },
});

export default accountSlice.reducer;
