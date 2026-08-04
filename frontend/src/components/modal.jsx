import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100vw - 24px)", sm: 560, md: 640 },
  maxWidth: "100%",
  maxHeight: { xs: "92vh", sm: "90vh" },
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: { xs: 3, sm: 4 },
  boxShadow: 24,
  p: { xs: 2.5, sm: 4 },
};
const ReusableModal = ({ open, onClose, title, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>{children}</Box>
      </Box>
    </Modal>
  );
};
export default ReusableModal;
