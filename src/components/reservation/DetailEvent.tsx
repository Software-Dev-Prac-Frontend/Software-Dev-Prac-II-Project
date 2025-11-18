"use client";

import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import getEvent from "@/libs/getEvent";
import { useEffect, useState } from "react";
import { EventModel, MODEL_DEFAULT } from "@/models/Event.model";
import { convertGoogleDriveUrl } from "@/libs/imageUtils";

export default function DetailEvent({ eventId }: { eventId: string }) {
    const [event,setEvent] = useState<EventModel>(MODEL_DEFAULT)
    if (!eventId) {
        return <></>;
    }
    useEffect(() => {
        async function fetchEvent() {
            const res = await getEvent(eventId);
            setEvent(res.data);
        }
        fetchEvent();
    }, [eventId]);
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: 320 },
            height: "auto",
            gap: 2,
            bgcolor: "white"
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
        </Box>
    );
}