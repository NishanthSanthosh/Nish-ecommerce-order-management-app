import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentAdmin } from "../services/authService";
import {
  clearAuthSession,
  getStoredToken,
  setAuthSession,
} from "../services/authStorage";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = getStoredToken();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: getCurrentAdmin,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (token && data?.data?.user) {
      setAuthSession({ token, user: data.data.user });
    }
  }, [data, token]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "#f8fafc",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "#0f766e" }} />
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Checking your session...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isError) {
    clearAuthSession();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
