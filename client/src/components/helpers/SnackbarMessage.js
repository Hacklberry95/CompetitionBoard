// src/components/AlertMessage.js
import React from "react";
import MuiAlert from "@mui/material/Alert";
import { useAlert } from "../../context/AlertContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertMessage = () => {
  const { snackbar, showSnackbar } = useAlert();

  const handleClose = () => {
    showSnackbar("");
  };

  return (
    snackbar.open && (
      <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 1300 }}>
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          style={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </div>
    )
  );
};

export default AlertMessage;
