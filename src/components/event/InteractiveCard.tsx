"use client";

import { Box } from "@mui/material";

export interface InteractiveCardProps {
    children ?: React.ReactNode;
}

export default function InteractiveCard({children}: InteractiveCardProps) {
    return (
        <Box sx={{
            width: "fit-content",
            height: "fit-content",
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.3s ease-in-out",
            // "&:hover": {
            //     boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            // },
        }}>
            {children}
        </Box>
    );
}