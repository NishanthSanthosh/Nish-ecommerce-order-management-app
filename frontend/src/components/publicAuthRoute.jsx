import { Navigate, Outlet } from "react-router-dom";
import { getStoredToken } from "../services/authStorage";

export default function PublicAuthRoute() {
  const token = getStoredToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
