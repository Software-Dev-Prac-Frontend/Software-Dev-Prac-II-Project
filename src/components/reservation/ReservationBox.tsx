"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Select, MenuItem, TextField, Typography } from "@mui/material";
import { Event } from "@/models/Event.model";

//TODO: Replace with real API call to fetch events
const MOCK_EVENTS: { success: boolean; count: number; data: Event[] } = {
    success: true,
    count: 6,
    data: [
        {
            _id: "1",
            name: "Bloom Festival",
            description: "A vibrant celebration of spring blooms",
            eventDate: "2024-08-15T18:00:00Z",
            venue: "Central Park",
            organizer: "City Events",
            availableTicket: 150,
            posterPicture: "/img/bloom.jpg",
            createdAt: "2024-07-01T10:00:00Z",
            updatedAt: "2024-07-15T14:00:00Z",
        },
        {
            _id: "2",
            name: "Summer Concert",
            description: "Live music performances",
            eventDate: "2024-08-20T19:00:00Z",
            venue: "Riverside Theater",
            organizer: "Music Productions",
            availableTicket: 200,
            posterPicture: "/img/bloom.jpg",
            createdAt: "2024-07-02T10:00:00Z",
            updatedAt: "2024-07-16T14:00:00Z",
        },
        {
            _id: "3",
            name: "Art Exhibition",
            description: "Contemporary art showcase",
            eventDate: "2024-08-25T10:00:00Z",
            venue: "Modern Art Gallery",
            organizer: "Art Society",
            availableTicket: 100,
            posterPicture: "/img/bloom.jpg",
            createdAt: "2024-07-03T10:00:00Z",
            updatedAt: "2024-07-17T14:00:00Z",
        },
        {
            _id: "4",
            name: "Food Festival",
            description: "Culinary delights from around the world",
            eventDate: "2024-09-01T12:00:00Z",
            venue: "Downtown Square",
            organizer: "Culinary Club",
            availableTicket: 300,
            posterPicture: "/img/bloom.jpg",
            createdAt: "2024-07-04T10:00:00Z",
            updatedAt: "2024-07-18T14:00:00Z",
        },
        {
            _id: "5",
            name: "Tech Conference",
            description: "Latest innovations in technology",
            eventDate: "2024-09-10T09:00:00Z",
            venue: "Convention Center",
            organizer: "Tech Innovations",
            availableTicket: 250,
            posterPicture: "/img/bloom.jpg",
            createdAt: "2024-07-05T10:00:00Z",
            updatedAt: "2024-07-19T14:00:00Z",
        },
        {
            _id: "6",
            name: "Jazz Night",
            description: "An evening of smooth jazz",
            eventDate: "2024-09-15T20:00:00Z",
            venue: "Blue Note Club",
            organizer: "Jazz Organization",
            availableTicket: 80,
            posterPicture: "/img/bloom.jpg",
            createdAt: "2024-07-06T10:00:00Z",
            updatedAt: "2024-07-20T14:00:00Z",
        },
    ]
}

interface ReservationBoxProps {
    eventId: string | null;
    onChange: (id: string | null) => void;
}

export default function ReservationBox({ eventId, onChange }: ReservationBoxProps) {
    const events = MOCK_EVENTS.data;
    const [selectedEventId, setSelectedEventId] = useState<string | "">("");

    useEffect(() => {
        setSelectedEventId(eventId ?? "");
        onChange(eventId ?? null);
    }, [eventId]);

    const handleEventChange = (id: string) => {
        setSelectedEventId(id);
        onChange(id);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: 320, height: "fit-content", bgcolor: "white", p: 2, borderRadius: 2, boxShadow: 3, alignItems: "center", gap: 2, justifyContent: "center" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ alignItems: "center", color: "#000" }}>
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

            <TextField label="Number of Tickets" variant="outlined" type="number" inputProps={{ min: 1, max: 5, defaultValue: 1 }} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" fullWidth>
                Reserve Now
            </Button>
        </Box>
    );
}