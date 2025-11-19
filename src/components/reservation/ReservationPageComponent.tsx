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
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 4 },
                p: { xs: 2, md: 0 }
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
            py: { xs: 2, md: 4 },
            px: { xs: 1, md: 2 }
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 4 },
                alignItems: { xs: "stretch", md: "stretch" },
                justifyContent: "center",
                width: "100%",
                alignContent: "center"
            }}>
                <DetailEvent eventId={eventId} />
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Divider
                        orientation="vertical"
                        sx={{
                            borderColor: "#000",
                            borderWidth: 0.5
                        }}
                    />
                </Box>
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <Divider
                        sx={{
                            borderColor: "#000",
                            borderWidth: 0.5
                        }}
                    />
                </Box>
                <Box sx={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                    <ReservationBox eventId={eventId} onChange={onChange} />
                </Box>
            </Box>
        </Box>
    );
}