"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";

interface AlertState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

interface AlertContextType {
    showAlert: (msg: string, severity?: AlertColor) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: "",
        severity: "info",
    });

    const showAlert = (message: string, severity: AlertColor = "info") => {
        setAlert({
        open: true,
        message,
        severity,
        });
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
        {children}

        {/* Global Alert */}
        <Snackbar
            open={alert.open}
            autoHideDuration={2000}
            onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
            <Alert
            onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
            severity={alert.severity}
            variant="filled"
            sx={{ width: "100%" }}
            >
            {alert.message}
            </Alert>
        </Snackbar>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
    return ctx;
};
