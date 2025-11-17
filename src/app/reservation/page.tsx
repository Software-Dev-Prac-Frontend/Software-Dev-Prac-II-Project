"use client";

import ReservationPageComponent from "@/components/reservation/ReservationPageComponent";
import { useSearchParams } from "next/navigation";

export default function ReservationPage(){
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId");
    return (
        <ReservationPageComponent eventId={eventId} />
    );
}