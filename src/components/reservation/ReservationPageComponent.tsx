"use client";

import DetailEvent from "@/components/reservation/DetailEvent";
import ReservationBox from "@/components/reservation/ReservationBox";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ReservationPageComponentProps {
    eventId: string;
    onChange: (id: string) => void;
}

export default function ReservationPageComponent({ eventId, onChange }: ReservationPageComponentProps) {
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        const t = localStorage.getItem("token");
        if (t) setToken(t);
    }, []);
    
    if (!token) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100%"
            }}>
                <Typography variant="h6" textAlign="center" color="#000">
                    Please login to view your reservations.
                </Typography>
            </Box>
        );
    }

    if (!eventId) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100%",
                flexDirection: "row",
                gap: 4
            }}>
                <ReservationBox eventId={eventId} onChange={onChange} />
            </Box>
        );
    }

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
            flexDirection: "row",
            gap: 4,
            py: 4
        }}>
            <DetailEvent eventId={eventId} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: "#000", borderWidth: 2, borderRadius: 10 }} />
            <ReservationBox eventId={eventId} onChange={onChange} />
        </Box>
    );
}