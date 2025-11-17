"use client";

import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";

const event = {
        _id: "1",
        name: "Bloom Festival",
        eventDate: "2024-08-15T18:00:00Z",
        venue: "Central Park",
        organizer: "City Events",
        availableTicket: 150,
        posterPicture: "/img/bloom.jpg",
};

export default function DetailEvent({ eventId }: { eventId: string | null }) {
    return (
        <Box sx={{display: "flex", flexDirection: "column", width: 320, height: "auto", gap: 2, bgcolor: "white"}}>
            <Image
                src={event.posterPicture || "/img/Bloom.jpg"}
                style={{width:"100%", height:"auto", borderRadius: "4px", objectFit: "cover"}}  
                alt="Party Image"
                width={200}
                height={200}
            />
            <Box sx={{color:"#000", gap: "8px"}}>
                <Typography variant="h6" fontWeight="bold">{event.name}</Typography>
                <Typography>Date: {dayjs(event.eventDate).format("DD/MM/YYYY")}</Typography>
                <Typography>Organizer: {event.organizer}</Typography>
                <Typography>Available Tickets: {event.availableTicket}</Typography>
            </Box>
        </Box>
    );
}