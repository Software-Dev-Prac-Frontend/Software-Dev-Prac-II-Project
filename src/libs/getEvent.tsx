import { EventJson } from "@/models/Event.model";

export default async function getEvent(eid: string): Promise<EventJson> {
    if (!eid) {
        throw new Error("Event id (eid) is required");
    }

    const eventsBaseUrl = process.env.NEXT_PUBLIC_EVENTS_BASE_URL || 'http://localhost:5000/api/v1/events';
    const endpoints = [
        eventsBaseUrl,
    ];

    let lastError: unknown = null;
    for (const baseUrl of endpoints) {
        const url = `${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(eid)}`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                lastError = new Error(`HTTP ${res.status} from ${url}`);
                continue;
            }
            const json = (await res.json()) as EventJson;
            return json;
        } catch (err) {
            lastError = err;
            continue;
        }
    }
    throw new Error(`Failed to fetch event ${eid} from all endpoints: ${String(lastError)}`);
}
