import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import "./App.css";
import NotFound from "./pages/not-found";
import CheckAuth from "./components/common/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { useEffect } from "react";
import AdminLayout from "./components/admin-view/layout";
// import AdminProduct from "./pages/admin-view/product";
import UnAuthPage from "./pages/unauth-page";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminCategory from "./pages/admin-view/category";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminAccounts from "./pages/admin-view/account";
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingProduct from "./pages/shopping-view/product";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import PaymentSuccess from "./pages/shopping-view/payment-success";
import AdminChatRoom from "./pages/admin-view/chat-room";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        {/* Auth View */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        {/* Admin View */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="category" element={<AdminCategory />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="accounts" element={<AdminAccounts />} />
          <Route path="chatrooms" element={<AdminChatRoom />} />
        </Route>
        {/* Client View */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="product" element={<ShoppingProduct />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
        </Route>
        {/* UnAuth-Page */}
        <Route path="/unauth-page" element={<UnAuthPage />} />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
