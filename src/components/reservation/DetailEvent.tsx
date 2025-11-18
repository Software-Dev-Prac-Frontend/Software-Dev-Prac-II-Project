"use client";

import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";

// TODO: API CALL TO GET EVENT DETAIL BY ID
const event = {
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
                <Typography>Description: {event.description}</Typography>
                <Typography>Venue: {event.venue}</Typography>
                <Typography>Date: {dayjs(event.eventDate).format("DD/MM/YYYY")}</Typography>
                <Typography>Organizer: {event.organizer}</Typography>
                <Typography>Available Tickets: {event.availableTicket}</Typography>
            </Box>
        </Box>
    );
}