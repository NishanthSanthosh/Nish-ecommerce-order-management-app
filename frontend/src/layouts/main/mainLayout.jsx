import * as React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarDrawer from "../../components/sidebar";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
// import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import Topbar from "../../components/appBar";

const drawerWidth = 280;

const menuItems = [
  { label: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
  { label: "Products", icon: <Inventory2Icon />, path: "/products" },
  { label: "Categories", icon: <CategoryIcon />, path: "/categories" },
  { label: "Orders", icon: <ShoppingCartIcon />, path: "/orders" },
  { label: "Users", icon: <PeopleIcon />, path: "/users" },
  { label: "Coupons", icon: <LocalOfferIcon />, path: "/coupons" },
  // Analytics is paused until reporting is fully implemented.
  // { label: "Analytics", icon: <BarChartIcon />, path: "/analytics" },
  { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
];
export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <CssBaseline />

      <Topbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />

      <SidebarDrawer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        menuItems={menuItems}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflow: "hidden",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 72, sm: 80 } }} />
        <Box
          sx={{
            mx: "auto",
            maxWidth: "1440px",
            width: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
