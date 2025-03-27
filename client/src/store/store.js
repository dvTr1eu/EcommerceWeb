import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminCategorySlice from "./admin/category-slice";
import adminAccountSlice from "./admin/account-slice";
import adminProductSlice from "./admin/product-slice";
import adminOrderSlice from "./admin/order-slice";
import adminHomeSlice from "./admin/home-slice";

import clientProductSlice from "./clientStore/product-slice";
import shoppingCartSlice from "./clientStore/cart-slice";
import shopOrderSlice from "./clientStore/order-slice";
import accountSlice from "./clientStore/account-slice";
import reviewSlice from "./clientStore/review-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: adminCategorySlice,
    account: adminAccountSlice,
    adminProduct: adminProductSlice,
    adminOrder: adminOrderSlice,
    adminHome: adminHomeSlice,

    clientProduct: clientProductSlice,
    shoppingCart: shoppingCartSlice,
    shopOrder: shopOrderSlice,
    accountClient: accountSlice,
    shopReview: reviewSlice,
  },
});

export default store;
