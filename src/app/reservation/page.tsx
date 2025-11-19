"use client";

import ReservationPageComponent from "@/components/reservation/ReservationPageComponent";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ReservationPageContent(){
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

export default function ReservationPage(){
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReservationPageContent />
        </Suspense>
    );
}