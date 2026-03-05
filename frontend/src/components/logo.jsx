import { Toolbar } from "@mui/material";
export default function Logo() {
  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
        color: "#3c8e9d",
        fontWeight: "900",
      }}
    >
      {/* NISH GROCERY 🥕 */}
      <img src="logo3.png" height="30rem" />
    </Toolbar>
  );
}
