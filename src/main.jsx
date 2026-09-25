import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { router } from "./Ruters";
import { AuthProvider } from "./pages/Auth/AuthContext";
import { CartProvider } from "./pages/Cart/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-center" autoClose={2500} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
