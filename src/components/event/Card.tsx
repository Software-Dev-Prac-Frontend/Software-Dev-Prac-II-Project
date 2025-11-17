"use client";

import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export interface Event {
    _id: string;
    name: string;
    description: string;
    eventDate: string;
    venue: string;
    organizer: string;
    availableTicket: number;
    posterPicture: string;
    createdAt: string;
    updatedAt: string;
}

interface CardProps {
    event: Event;
}

export default function Card({
    event,
}: CardProps) {
    const router = useRouter();
    const reserveEvent = () => {
        router.push(`/reservation?eventId=${event._id}`);
        console.log(`Reserving event: ${event.name}`);
    }
    return (
        <InteractiveCard>
            <Box sx={{display: "flex", flexDirection: "column", width: 320, height: "auto", gap: 2, p: 2, bgcolor: "white", border: 2, borderColor: "#6d9468", borderRadius: 2}}>
                <Image
                    src={event.posterPicture || "/img/Bloom.jpg"}
                    style={{width:"100%", height:"auto", borderRadius: "4px", objectFit: "cover"}}  
                    alt="Party Image"
                    width={200}
                    height={200}
                />
                <Box sx={{color:"#000", gap: "8px"}}>
                    <Typography variant="h6" fontWeight="bold">{event.name}</Typography>
                    <Typography>{event.description}</Typography>
                    <Typography>Venue: {event.venue}</Typography>
                    <Typography>Date: {dayjs(event.eventDate).format("DD/MM/YYYY")}</Typography>
                    <Typography>Organizer: {event.organizer}</Typography>
                    <Typography>Available Tickets: {event.availableTicket}</Typography>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" fullWidth onClick={reserveEvent}>
                        Reserve Now
                    </Button>
                </Box>
            </Box>
        </InteractiveCard>
    );
}