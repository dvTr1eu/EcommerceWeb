import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  isLoading: false,
  productList: [],
  productSearchList: [],
};

const token = Cookies.get("token");

export const addNewProduct = createAsyncThunk(
  "/product/addNewProduct",
  async (formData) => {
    if (token) {
      const result = await axios.post(
        "https://localhost:44304/api/Admin/AdminProducts/AddProduct",
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

export const getAllProduct = createAsyncThunk(
  "/product/getAllProduct",
  async () => {
    if (token) {
      const result = await axios.get(
        "https://localhost:44304/api/Admin/AdminProducts/GetAllProducts",
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

export const getBySearchCondition = createAsyncThunk(
  "/product/getBySearchCondition",
  async ({ searchKey, pageNumber, pageSize }) => {
    let url = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (searchKey != null) {
      url += `&searchKey=${searchKey}`;
    }
    const result = await axios.get(
      `https://localhost:44304/api/UserProducts/FindBySearchKey${url}`
    );
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/product/editProduct",
  async ({ id, formData }) => {
    if (token) {
      const result = await axios.put(
        `https://localhost:44304/api/Admin/AdminProducts/UpdateProduct/?id=${id}`,
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

export const deleteProduct = createAsyncThunk(
  "/product/deleteProduct",
  async (id) => {
    if (token) {
      const result = await axios.delete(
        `https://localhost:44304/api/Admin/AdminProducts/DeleteProduct/${id}`,
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

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.productSearchList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.allProducts.$values;
        state.totalItems = action.payload?.totalItems;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
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
      });
  },
});

export const { resetSearchResults } = adminProductSlice.actions;

export default adminProductSlice.reducer;
