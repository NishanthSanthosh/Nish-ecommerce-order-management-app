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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./ErrorHandler/ErrorBoundary";
import ProtectedRoute from "./components/protectedRoute";
import PublicAuthRoute from "./components/publicAuthRoute";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route element={<PublicAuthRoute />}>
            <Route element={<AuthLayout />}>
              <Route
                path="/signup"
                element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/login"
                element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/users" />} />
              <Route
                path="/dashboard"
                element={
                  <ErrorBoundary>
                    <Dashboard />{" "}
                  </ErrorBoundary>
                }
              />
              <Route
                path="/products"
                element={
                  <ErrorBoundary>
                    <Products />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/categories"
                element={
                  <ErrorBoundary>
                    <Categories />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/orders"
                element={
                  <ErrorBoundary>
                    <Orders />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/users"
                element={
                  <ErrorBoundary>
                    <Users />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/coupons"
                element={
                  <ErrorBoundary>
                    <Coupons />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/settings"
                element={
                  <ErrorBoundary>
                    <Settings />
                  </ErrorBoundary>
                }
              />
            </Route>
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
