import { Box, CssBaseline, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <CssBaseline />
      {/* <Container maxWidth="xl"> */}
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Outlet />
      </Box>
      {/* </Container> */}
    </>
  );
}
