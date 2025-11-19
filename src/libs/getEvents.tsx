import { EventsJson } from "@/models/Event.model";

export default async function getEvents(): Promise<EventsJson> {
    const eventsBaseUrl = process.env.NEXT_PUBLIC_EVENTS_BASE_URL || 'http://localhost:5000/api/v1/events';
    const endpoints = [
        eventsBaseUrl,
    ];
    
    let lastError: unknown = null;
    for (const url of endpoints) {
        try {
            const res = await fetch(url);
                if (!res.ok) {
                    lastError = new Error(`HTTP ${res.status} from ${url}`);
                    continue;
                }
                const json = (await res.json()) as EventsJson;
                return json;
        } catch (err) {
            lastError = err;
            continue;
        }
    }
    throw new Error(`Failed to fetch events from all endpoints: ${String(lastError)}`);
}
