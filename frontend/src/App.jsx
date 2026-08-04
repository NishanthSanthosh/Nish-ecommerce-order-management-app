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
// import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./ErrorHandler/ErrorBoundary";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route element={<AuthLayout />}>
            <Route
              path="/signup"
              element={
                <ErrorBoundary>
                  <Signup />{" "}
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
          <Route element={<DashboardLayout />}>
            {/* <ErrorBoundary> */}
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
            {/* Analytics is paused until reporting is fully implemented. */}
            {/* <Route
              path="/analytics"
              element={
                <ErrorBoundary>
                  <Analytics />
                </ErrorBoundary>
              }
            /> */}
            <Route
              path="/settings"
              element={
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              }
            />
            {/* </ErrorBoundary> */}
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
