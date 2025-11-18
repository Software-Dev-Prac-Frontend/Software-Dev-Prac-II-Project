"use client";

import { Box } from "@mui/material";
import Card from "./Card";
import Banner from "./Banner";
import { EventModel } from "@/models/Event.model";
import { useEffect, useState } from "react";
import getEvents from "@/libs/getEvents";

export default function EventPageComponent(){
    const [events,setEvents] = useState<EventModel[]>([]);
    useEffect(() => {
        async function fetchEvent() {
            const res = await getEvents();
            setEvents(res.data);
        }
        fetchEvent();
    }, []);
    return(
        <Box>
            <Banner />
            <Box sx={{display:"flex", justifyContent:"center",alignContent:"center", gap:4, padding:2, flexWrap:"wrap"}}>
                {events.map((event:EventModel) => (
                    <Box key={event._id}>
                        <Card event={event} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}