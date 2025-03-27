import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  isLoading: false,
  categoryList: [],
};

const token = Cookies.get("token");

export const addNewCategory = createAsyncThunk(
  "/category/addNewCategory",
  async (formData) => {
    if (token) {
      const result = await axios.post(
        "https://localhost:44304/api/Admin/AdminCategory/Add",
        formData,
        {
          headers: {
            Authorization: `${token}`, // Thêm token vào header
          },
        }
      );
      return result?.data;
    } else {
      console.log("Token not found");
    }
  }
);

export const getAllCategory = createAsyncThunk(
  "/category/getAllCategory",
  async () => {
    // if (token) {
    const result = await axios.get(
      "https://localhost:44304/api/Admin/AdminCategory/GetAllCategory"
      // {
      //   headers: {
      //     Authorization: `${token}`,
      //   },
      // }
    );
    return result?.data;
    // } else {
    //   console.log("Token not found");
    // }
  }
);

export const editCategory = createAsyncThunk(
  "/category/editCategory",
  async ({ id, formData }) => {
    console.log(formData);

    if (token) {
      const result = await axios.put(
        `https://localhost:44304/api/Admin/AdminCategory/Update/?id=${id}`,
        formData,
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

export const deleteCategory = createAsyncThunk(
  "/category/deleteCategory",
  async (id) => {
    if (token) {
      const result = await axios.delete(
        `https://localhost:44304/api/Admin/AdminCategory/Delete/?id=${id}`,
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

const adminCategorySlice = createSlice({
  name: "adminCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.$values;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.categoryList = [];
      });
  },
});

export default adminCategorySlice.reducer;
