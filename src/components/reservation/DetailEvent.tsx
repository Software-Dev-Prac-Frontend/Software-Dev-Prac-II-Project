"use client";

import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import getEvent from "@/libs/getEvent";
import { useEffect, useState } from "react";
import { EventModel, MODEL_DEFAULT } from "@/models/Event.model";

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