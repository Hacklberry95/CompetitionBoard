// src/components/SnackbarMessage.js
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAlert } from "../../context/AlertContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarMessage = () => {
  const { snackbar, showSnackbar } = useAlert();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    showSnackbar("");
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert onClose={handleClose} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMessage;
