import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Chip,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession, getStoredUser } from "../services/authStorage";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/orders": "Orders",
  "/users": "Users",
  "/coupons": "Coupons",
  "/settings": "Settings",
};

export default function Topbar({ drawerWidth, handleDrawerToggle }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[pathname] || "Dashboard";
  const currentUser = getStoredUser();
  const adminName = currentUser?.name || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: "rgba(255, 255, 255, 0.9)",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 72, sm: 80 },
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1.5, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" fontWeight={800} noWrap>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Welcome back, {adminName}. Here is your grocery operations overview.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label="Admin"
            size="small"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              bgcolor: "#ecfdf5",
              color: "#047857",
              fontWeight: 700,
            }}
          />
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#0f766e",
              fontWeight: 800,
              boxShadow: "0 10px 20px rgba(15, 118, 110, 0.2)",
            }}
          >
            {adminInitial}
          </Avatar>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              display: { xs: "none", md: "inline-flex" },
              borderColor: "#cbd5e1",
              color: "#475569",
              borderRadius: 2,
              fontWeight: 800,
              textTransform: "none",
              "&:hover": {
                borderColor: "#0f766e",
                bgcolor: "#f0fdfa",
                color: "#0f766e",
              },
            }}
          >
            Logout
          </Button>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: "#475569",
              border: "1px solid #cbd5e1",
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
