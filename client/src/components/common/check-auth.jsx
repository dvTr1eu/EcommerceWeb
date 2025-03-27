import { Navigate, useLocation, useNavigate } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" />;
    }
  }

  if (!isAuthenticated && location.pathname.startsWith("/shop/account")) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  const cartRelatedPaths = ["/cart", "/checkout", "/add-to-cart"];
  if (
    !isAuthenticated &&
    cartRelatedPaths.some((path) => location.pathname.startsWith(path))
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    ) &&
    !location.pathname.startsWith("/shop")
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return user?.role === "Admin" ? (
      <Navigate to="/admin/dashboard" />
    ) : (
      <Navigate to="/shop/home" />
    );
  }

  //Login với quyền ko phải Admin
  if (
    isAuthenticated &&
    user?.role !== "Admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "Admin" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (
    isAuthenticated &&
    user?.role === "Admin" &&
    (location.pathname === "/login" || location.pathname === "/register") &&
    navigate.state?.from?.pathname.startsWith("/shop")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
