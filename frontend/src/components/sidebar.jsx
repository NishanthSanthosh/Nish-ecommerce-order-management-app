import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from "./logo";

export default function SidebarDrawer({
  mobileOpen,
  setMobileOpen,
  menuItems,
  drawerWidth,
}) {
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ display: "flex", minHeight: "100%", flexDirection: "column" }}>
      <Logo />
      <Divider sx={{ borderColor: "#e5e7eb" }} />
      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {menuItems.map(({ label, icon, path }) => (
          <NavLink to={path} key={path} onClick={() => setMobileOpen(false)}>
            {({ isActive }) => (
              <ListItem disablePadding sx={{ mb: 0.75 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    px: 2,
                    color: isActive ? "#0f766e" : "#475569",
                    bgcolor: isActive
                      ? "rgba(20, 184, 166, 0.12)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: isActive
                        ? "rgba(20, 184, 166, 0.16)"
                        : "#f1f5f9",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActive ? 800 : 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </NavLink>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e5e7eb",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e5e7eb",
            boxShadow: "8px 0 24px rgba(15, 23, 42, 0.04)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
