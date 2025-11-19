"use client";

import { useEffect, useState } from "react";
import { Box, Button, Select, MenuItem, TextField, Typography, Alert } from "@mui/material";
import { EventModel } from "@/models/Event.model";
import getEvents from "@/libs/getEvents";
import { createTicketing } from "@/libs/createTicketing";
import { useRouter } from "next/navigation";
import { useAlert } from "@/contexts/AlertContext";

interface ReservationBoxProps {
    eventId: string;
    onChange: (id: string) => void;
}

export default function ReservationBox({ eventId, onChange }: ReservationBoxProps) {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [ticket, setTicket] = useState<number>(1);
    const [token, setToken] = useState<string>("");
    const router = useRouter();
    const { showAlert } = useAlert();
    
    useEffect(() => {
        const t = localStorage.getItem("token");
        if (t) setToken(t);
    }, []);

    async function handleCreateEvent() {
        if(!token){
            showAlert("Please login to reserve ticket.", "error");
        }
        else{
            try{
                console.log("Creating ticketing for eventId:", eventId, "with", ticket, "tickets.");
            await createTicketing(eventId, ticket, token);
            router.push("/myreservation");
            showAlert("Reservation successful!", "success");
            } catch (err: any) {
                showAlert(err.message || "Reservation failed", "error");
            }
        }
    }
    useEffect(() => {
        async function fetchEvent() {
            const res = await getEvents();
            setEvents(res.data);
        }
        fetchEvent();
    }, []);
    
    const [selectedEventId, setSelectedEventId] = useState<string>("");

    useEffect(() => {
        setSelectedEventId(eventId ?? "");
        onChange(eventId ?? "");
    }, [eventId]);

    const handleEventChange = (id: string) => {
        setSelectedEventId(id);
        onChange(id);
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "100%", md: 320 },
            height: "fit-content",
            bgcolor: "white",
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: 3,
            gap: 2
        }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#000" }}>
                Reservation
            </Typography>
            <Select
                fullWidth
                value={selectedEventId}
                onChange={(e: any) => handleEventChange(e.target.value)}
                displayEmpty
            >
                <MenuItem value="" disabled>
                    Select Event
                </MenuItem>
                {events.map((ev) => (
                    <MenuItem key={ev._id} value={ev._id}>
                        {ev.name}
                    </MenuItem>
                ))}
            </Select>

            <TextField label="Number of Tickets" variant="outlined" type="number" inputProps={{ min: 1, max: 5 }} fullWidth value={ticket} onChange={(e) => setTicket(Number(e.target.value))} />
            <Button variant="contained" color="primary" fullWidth onClick={handleCreateEvent}>
                Reserve Now
            </Button>
        </Box>
    );
}