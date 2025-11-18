"use client";

import { Box } from "@mui/material";
import Card from "./Card";
import Banner from "./Banner";
import { EventModel } from "@/models/Event.model";

const MOCK_EVENTS: { success: boolean; count: number; data: EventModel[] } = {
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

export default function EventPageComponent(){
    return(
        <Box>
            <Banner />
            <Box sx={{display:"flex", justifyContent:"center",alignContent:"center", gap:4, padding:2, flexWrap:"wrap"}}>
                {MOCK_EVENTS.data.map((event) => (
                    <Box key={event._id}>
                        <Card event={event} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}