import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (formData) => {
    const response = await axios.post(
      `https://localhost:44304/api/Carts/AddToCart`,
      formData
    );

    return response.data;
  }
);

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (userId) => {
    const response = await axios.get(
      `https://localhost:44304/api/Carts/GetCartItem/?customerId=${userId}`
    );

    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ formUpdate, cartId }) => {
    const response = await axios.put(
      `https://localhost:44304/api/Carts/UpdateCartItem/?id=${cartId}`,
      formUpdate
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (cartId) => {
    const response = await axios.delete(
      `https://localhost:44304/api/Carts/RemoveCartItem/?id=${cartId}`
    );

    return response.data;
  }
);

export const clearAllCartItem = createAsyncThunk(
  "cart/clearAllCartItem",
  async (customerId) => {
    const response = await axios.delete(
      `https://localhost:44304/api/Carts/RemoveAllCartItem/?customerId=${customerId}`
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //add
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = true;
        state.cartItems = action.payload.$values;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      //get
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = true;
        state.cartItems = action.payload.$values;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      //update
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = true;
        state.cartItems = action.payload.$values;
      })
      .addCase(updateCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      //delete
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = true;
        state.cartItems = action.payload.$values;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      //removeAll
      .addCase(clearAllCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearAllCartItem.fulfilled, (state, action) => {
        state.isLoading = true;
        state.cartItems = action.payload.$values;
      })
      .addCase(clearAllCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;
