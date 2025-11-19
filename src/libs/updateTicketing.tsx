import axios from "axios";

export async function updateTicketing(id: string, amount: number, token: string) {
    const ticketingUrl = process.env.NEXT_PUBLIC_TICKETING_BASE_URL || 'http://localhost:5000/api/v1/ticketing';
    const res = await axios.put(
        `${ticketingUrl}/${id}`,
        { ticketAmount: amount },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    return res.data;
}
