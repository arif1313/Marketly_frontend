import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./Layout/MainLayout";
import VendorLayout from "./Layout/VendorLayout";
import AdminLayout from "./Layout/AdminLayout";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";

import Home from "./pages/Home/Home";
import ProductListing from "./pages/Products/ProductListing";
import ProductDetails from "./pages/Products/ProductDetails";
import VendorsList from "./pages/Shop/VendorsList";
import ShopPage from "./pages/Shop/ShopPage";
import CartPage from "./pages/Cart/CartPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import OrderConfirmation from "./pages/Checkout/OrderConfirmation";
import Login from "./pages/Auth/Login";
import RegisterCustomer from "./pages/Auth/RegisterCustomer";
import RegisterVendor from "./pages/Auth/RegisterVendor";
import MyOrders from "./pages/Account/MyOrders";

import VendorOverview from "./pages/Vendor/VendorOverview";
import VendorProducts from "./pages/Vendor/VendorProducts";
import VendorProductForm from "./pages/Vendor/VendorProductForm";
import VendorOrders from "./pages/Vendor/VendorOrders";
import VendorProfile from "./pages/Vendor/VendorProfile";

import AdminOverview from "./pages/Admin/AdminOverview";
import AdminVendors from "./pages/Admin/AdminVendors";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminCustomers from "./pages/Admin/AdminCustomers";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminReviews from "./pages/Admin/AdminReviews";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <ProductListing /> },
      { path: "products/:idOrSlug", element: <ProductDetails /> },
      { path: "vendors", element: <VendorsList /> },
      { path: "shops/:idOrSlug", element: <ShopPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <RegisterCustomer /> },
      { path: "register/vendor", element: <RegisterVendor /> },
      {
        element: <ProtectedRoute roles={["customer"]} />,
        children: [{ path: "account/orders", element: <MyOrders /> }],
      },
    ],
  },
  {
    path: "/vendor",
    element: <ProtectedRoute roles={["vendor"]} />,
    children: [
      {
        element: <VendorLayout />,
        children: [
          { index: true, element: <VendorOverview /> },
          { path: "products", element: <VendorProducts /> },
          { path: "products/new", element: <VendorProductForm /> },
          { path: "products/:id/edit", element: <VendorProductForm /> },
          { path: "orders", element: <VendorOrders /> },
          { path: "profile", element: <VendorProfile /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute roles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverview /> },
          { path: "vendors", element: <AdminVendors /> },
          { path: "products", element: <AdminProducts /> },
          { path: "customers", element: <AdminCustomers /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "reviews", element: <AdminReviews /> },
        ],
      },
    ],
  },
]);
