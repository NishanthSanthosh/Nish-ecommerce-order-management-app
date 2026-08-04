import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/orders": "Orders",
  "/users": "Users",
  "/coupons": "Coupons",
  // "/analytics": "Analytics",
  "/settings": "Settings",
};

export default function Topbar({ drawerWidth, handleDrawerToggle }) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Dashboard";

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
              Welcome back, Nishanth. Here is your grocery operations overview.
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
            N
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
