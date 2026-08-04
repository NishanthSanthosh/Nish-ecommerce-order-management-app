import { Box, Toolbar, Typography } from "@mui/material";

export default function Logo() {
  return (
    <Toolbar
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        minHeight: "80px !important",
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 42,
          height: 42,
          borderRadius: 2,
          background: "linear-gradient(135deg, #16a34a, #0f766e)",
          color: "white",
          fontWeight: 900,
          boxShadow: "0 12px 24px rgba(15, 118, 110, 0.24)",
        }}
      >
        NG
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={800} lineHeight={1.1}>
          Nish Groceries
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Order Management
        </Typography>
      </Box>
    </Toolbar>
  );
}
