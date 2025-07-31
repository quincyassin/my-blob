"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert, AlertTitle } from "@mui/material";

interface AlertContextType {
  showSuccessAlert: (message: string) => void;
  showErrorAlert: (message: string) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const showSuccessAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType("error");
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000); // 错误信息显示更长时间
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  return (
    <AlertContext.Provider
      value={{ showSuccessAlert, showErrorAlert, hideAlert }}
    >
      {children}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert severity={alertType}>
            <AlertTitle>{alertMessage}</AlertTitle>
          </Alert>
        </div>
      )}
    </AlertContext.Provider>
  );
};
