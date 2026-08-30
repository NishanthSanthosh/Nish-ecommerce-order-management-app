import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(token));
  const [isSessionValid, setIsSessionValid] = useState(false);
  
  useEffect(() => {
    if (!token) return;

    let isCancelled = false;

    const checkCurrentAdmin = async () => {
      try {
        const response = await getCurrentAdmin();

        if (isCancelled) return;

        if (response?.data?.user) {
          setAuthSession({ token, user: response.data.user });
          setIsSessionValid(true);
        } else {
          clearAuthSession();
          setIsSessionValid(false);
        }
      } catch {
        if (!isCancelled) {
          clearAuthSession();
          setIsSessionValid(false);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingSession(false);
        }
      }
    };

    checkCurrentAdmin();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isCheckingSession) {
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

  if (!isSessionValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
