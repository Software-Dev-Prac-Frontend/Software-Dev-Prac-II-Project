import axios from "axios";

export async function getTicketings(token: string) {
    try {
        const ticketingUrl = process.env.NEXT_PUBLIC_TICKETING_BASE_URL || 'http://localhost:5000/api/v1/ticketing';
        const res = await axios.get(
        `${ticketingUrl}/`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        return res.data;
    } catch (err: any) {
        console.error("getTicketings error:", err.response?.data || err.message);
        throw err;
    }
}
