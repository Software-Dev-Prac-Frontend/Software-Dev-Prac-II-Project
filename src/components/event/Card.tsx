"use client";

import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { EventModel } from "@/models/Event.model";
import { convertGoogleDriveUrl } from "@/libs/imageUtils";
import { useAuth } from "@/contexts/AuthContext";

interface CardProps {
    event: EventModel;
}

export default function Card({
    event,
}: CardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const reserveEvent = () => {
        router.push(`/reservation?eventId=${event._id}`);
        console.log(`Reserving event: ${event.name}`);
    }
    return (
        <InteractiveCard>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", sm: 320 },
                height: "auto",
                gap: 2,
                p: { xs: 2, sm: 4 },
                bgcolor: "white",
                border: 2,
                borderColor: "#6d9468",
                borderRadius: 2
            }}>
                <Image
                    src={convertGoogleDriveUrl(event.posterPicture) || "/img/Bloom.jpg"}
                    style={{ width: "100%", height: "auto", borderRadius: "4px", objectFit: "cover" }}
                    alt={event.name}
                    width={200}
                    height={200}
                />
                <Box sx={{ color: "#000", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold">{event.name}</Typography>
                    <Typography variant="body2">Description: {event.description}</Typography>
                    <Typography variant="body2">Venue: {event.venue}</Typography>
                    <Typography variant="body2">Date: {dayjs(event.eventDate).format("DD/MM/YYYY")}</Typography>
                    <Typography variant="body2">Organizer: {event.organizer}</Typography>
                    <Typography variant="body2">Available Tickets: {event.availableTicket}</Typography>
                </Box>
                {user && user.role === 'member' && (
                    <Button variant="contained" color="primary" fullWidth onClick={reserveEvent}>
                        Reserve Now
                    </Button>
                )}
            </Box>
        </InteractiveCard>
    );
}