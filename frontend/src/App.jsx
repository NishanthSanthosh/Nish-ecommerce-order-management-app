import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/auth/authLayout";
import DashboardLayout from "./layouts/main/mainLayout";

import Login from "./pages/login";
import Users from "./pages/users";
import Dashboard from "./pages/dashboard";
import Products from "./pages/products";
import Categories from "./pages/categories";
import Orders from "./pages/orders";
import Coupons from "./pages/coupons";
import Settings from "./pages/settings";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/protectedRoute";
import PublicAuthRoute from "./components/publicAuthRoute";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route element={<PublicAuthRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<Login />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/users" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
