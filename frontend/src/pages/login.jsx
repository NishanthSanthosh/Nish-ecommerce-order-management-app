import {
  Box,
  Button,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";
  const mode = isSignup ? "signup" : "login";
  const [formData, setFormData] = useState(
    isSignup ? signupDefaults : loginDefaults,
  );
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeChange = (_, nextMode) => {
    if (!nextMode || nextMode === mode) return;
    setFormData(nextMode === "signup" ? signupDefaults : loginDefaults);
    setFormErrors({});
    navigate(nextMode === "signup" ? "/signup" : "/login", { replace: true });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (isSignup) {
      if (!formData.name.trim()) nextErrors.name = "Name is required";
      else if (formData.name.trim().length < 3) {
        nextErrors.name = "Minimum 3 characters";
      }

      if (!formData.phone.trim()) nextErrors.phone = "Phone number is required";
      else if (!phonePattern.test(formData.phone)) {
        nextErrors.phone = "Enter a valid phone number";
      }

      if (!formData.address.trim()) nextErrors.address = "Address is required";
      else if (formData.address.trim().length < 8) {
        nextErrors.address = "Enter a complete address";
      }

      if (!formData.confirmPassword) {
        nextErrors.confirmPassword = "Please confirm your password";
      } else if (formData.confirmPassword !== formData.password) {
        nextErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!formData.password) nextErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      nextErrors.password = "Minimum 6 characters";
    }

    return nextErrors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (isSignup) {
        const signupPayload = { ...formData };
        delete signupPayload.confirmPassword;
        response = await signupAdmin(signupPayload);
      } else {
        response = await loginAdmin({
          email: formData.email,
          password: formData.password,
        });
      }

      setAuthSession({
        token: response.token,
        user: response.data.user,
      });

      toast.success(isSignup ? "Admin account created" : "Login successful");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Nish Groceries Admin
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {isSignup
                ? "Create an admin account to manage the store."
                : "Login to manage orders, products, and customers."}
            </Typography>
          </Box>

          <Tabs
            value={mode}
            onChange={handleModeChange}
            variant="fullWidth"
            sx={{
              borderBottom: "1px solid #e5e7eb",
              "& .MuiTab-root": {
                fontWeight: 700,
                textTransform: "none",
              },
              "& .Mui-selected": {
                color: "#0f766e !important",
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#0f766e",
              },
            }}
          >
            <Tab label="Login" value="login" />
            <Tab label="Sign Up" value="signup" />
          </Tabs>

          <Typography variant="body2" color="text.secondary">
            Only admin accounts can access this dashboard.
          </Typography>

          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {isSignup && (
              <>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Nishanth Kumar"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 9876543210"
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                />
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, city, state, zip code"
                  multiline
                  rows={3}
                  error={!!formErrors.address}
                  helperText={formErrors.address}
                />
              </>
            )}

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="admin@example.com"
              error={!!formErrors.email}
              helperText={formErrors.email}
            />

            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type="password"
              placeholder="Enter your password"
              error={!!formErrors.password}
              helperText={formErrors.password}
            />

            {isSignup && (
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                type="password"
                placeholder="Re-enter your password"
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                mt: 1,
                py: 1.2,
                bgcolor: "#0f766e",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "#115e59" },
              }}
            >
              {isSubmitting
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Login"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
