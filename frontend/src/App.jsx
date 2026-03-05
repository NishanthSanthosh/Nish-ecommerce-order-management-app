import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/auth/authLayout";
import DashboardLayout from "./layouts/main/mainLayout";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Users from "./pages/users";
import Dashboard from "./pages/dashboard";
import Products from "./pages/products";
import Categories from "./pages/categories";
import Orders from "./pages/orders";
import Coupons from "./pages/coupons";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/users" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
