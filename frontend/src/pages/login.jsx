import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAdmin, signupAdmin } from "../services/authService";
import { setAuthSession } from "../services/authStorage";

const loginDefaults = {
  email: "",
  password: "",
};

const signupDefaults = {
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
};

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";
  const mode = isSignup ? "signup" : "login";

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: loginDefaults,
  });

  useEffect(() => {
    reset(isSignup ? signupDefaults : loginDefaults);
  }, [isSignup, reset]);

  const authMutation = useMutation({
    mutationFn: async (formData) => {
      if (isSignup) {
        const signupPayload = { ...formData };
        delete signupPayload.confirmPassword;
        return signupAdmin(signupPayload);
      }

      return loginAdmin({
        email: formData.email,
        password: formData.password,
      });
    },
    onSuccess: (response) => {
      setAuthSession({
        token: response.token,
        user: response.data.user,
      });

      toast.success(isSignup ? "Admin account created" : "Login successful");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Authentication failed");
    },
  });

  const handleModeChange = (_, nextMode) => {
    if (!nextMode || nextMode === mode) return;
    navigate(nextMode === "signup" ? "/signup" : "/login", { replace: true });
  };

  const onSubmit = (formData) => {
    authMutation.mutate(formData);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1.5, sm: 2, md: 4 },
        background:
          "radial-gradient(circle at top left, rgba(20, 184, 166, 0.16), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1080,
          overflow: "hidden",
          borderRadius: { xs: 3, md: 5 },
          border: "1px solid #e5e7eb",
          boxShadow: "0 30px 80px rgba(15, 23, 42, 0.12)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.95fr 1.05fr" },
        }}
      >
        <Box
          sx={{
            p: { xs: 2.5, sm: 3, md: 5 },
            color: "white",
            minHeight: { xs: 220, sm: 260, md: "auto" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background:
              "linear-gradient(150deg, #0f766e 0%, #134e4a 55%, #0f172a 100%)",
          }}
        >
          <Stack spacing={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.14)",
                border: "1px solid rgba(255, 255, 255, 0.24)",
              }}
            >
              <ShoppingBasketIcon />
            </Box>

            <Box>
              <Typography variant="overline" sx={{ opacity: 0.75, fontWeight: 800 }}>
                Nish Groceries Admin
              </Typography>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{
                  mt: 1,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                Manage your grocery operations with confidence.
              </Typography>
              <Typography sx={{ mt: 2, color: "rgba(255, 255, 255, 0.76)" }}>
                Sign in or create an admin account to manage products, orders,
                customers, coupons, and store settings.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ mt: 4, flexWrap: "wrap" }}>
            <Chip
              icon={<AdminPanelSettingsIcon />}
              label="Admin only"
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.14)",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
            <Chip
              icon={<LockOutlinedIcon />}
              label="JWT secured"
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.14)",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2.5, sm: 4, md: 5 }, bgcolor: "white" }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={900}>
                {isSignup ? "Create admin account" : "Welcome back"}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {isSignup
                  ? "Create credentials for this order management dashboard."
                  : "Log in with an active admin account to continue."}
              </Typography>
            </Box>

            <Tabs
              value={mode}
              onChange={handleModeChange}
              variant="fullWidth"
              sx={{
                minHeight: 48,
                p: 0.5,
                borderRadius: 3,
                bgcolor: "#f1f5f9",
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTab-root": {
                  minHeight: 40,
                  borderRadius: 2,
                  fontWeight: 800,
                  textTransform: "none",
                },
                "& .Mui-selected": {
                  bgcolor: "white",
                  color: "#0f766e !important",
                  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
                },
              }}
            >
              <Tab label="Login" value="login" />
              <Tab label="Sign Up" value="signup" />
            </Tabs>

            <Alert severity="info" sx={{ borderRadius: 3 }}>
              Customer accounts cannot access this dashboard. Sign up creates an
              Admin account.
            </Alert>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {isSignup && (
                <>
                  <TextField
                    label="Full Name"
                    placeholder="e.g., Nishanth Kumar"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                    })}
                  />
                  <TextField
                    label="Phone Number"
                    placeholder="e.g., 9876543210"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+\-\s()]{7,20}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                  />
                  <TextField
                    label="Address"
                    placeholder="Street, city, state, zip code"
                    multiline
                    rows={3}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 8,
                        message: "Enter a complete address",
                      },
                    })}
                  />
                </>
              )}

              <TextField
                label="Email"
                type="email"
                placeholder="admin@example.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />

              <TextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />

              {isSignup && (
                <TextField
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") || "Passwords do not match",
                  })}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={authMutation.isPending}
                sx={{
                  mt: 1,
                  py: 1.35,
                  borderRadius: 2.5,
                  bgcolor: "#0f766e",
                  fontWeight: 900,
                  textTransform: "none",
                  boxShadow: "0 14px 28px rgba(15, 118, 110, 0.22)",
                  "&:hover": { bgcolor: "#115e59" },
                }}
              >
                {authMutation.isPending
                  ? "Please wait..."
                  : isSignup
                    ? "Create Admin Account"
                    : "Login"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
