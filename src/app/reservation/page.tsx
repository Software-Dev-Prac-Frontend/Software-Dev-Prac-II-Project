"use client";

import ReservationPageComponent from "@/components/reservation/ReservationPageComponent";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationPage(){
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId") || "";
    const [eventIdState, setEventIdState] = useState<string>("");

    useEffect(() => {
        setEventIdState(eventId);
    }, [eventId]);

    return (
        <ReservationPageComponent eventId={eventIdState} onChange={setEventIdState} />
    );
}