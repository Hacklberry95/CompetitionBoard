// src/context/AlertContext.js
import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "success",
    open: false,
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ message, severity, open: true });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000); // Auto-close after 3 seconds
  };

  return (
    <AlertContext.Provider value={{ snackbar, showSnackbar }}>
      {children}
    </AlertContext.Provider>
  );
};
