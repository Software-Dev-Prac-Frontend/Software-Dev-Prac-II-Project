"use client";

import DetailEvent from "@/components/reservation/DetailEvent";
import ReservationBox from "@/components/reservation/ReservationBox";
import { Box, Divider } from "@mui/material";

interface ReservationPageComponentProps {
    eventId: string | null;
    onChange: (id: string | null) => void;
}

export default function ReservationPageComponent({ eventId,onChange }: ReservationPageComponentProps) {
    if (!eventId) {
        return (
            <Box sx={{display:"flex",justifyContent:"center",alignContent:"center",mt:20,flexDirection:"row",gap:4}}>
                <ReservationBox eventId={eventId} onChange={onChange} />
            </Box>
        );
    }
    return (
        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",mt:20,flexDirection:"row",gap:4}}>
            <DetailEvent eventId={eventId} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: "#000",borderWidth: 2,borderRadius: 10}} />
            <ReservationBox eventId={eventId} onChange={onChange} />
        </Box>
    );
}