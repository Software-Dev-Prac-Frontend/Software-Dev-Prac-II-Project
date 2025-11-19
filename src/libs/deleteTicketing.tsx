import axios from "axios";

export async function deleteTicketing(id: string, token: string) {
    const ticketingUrl = process.env.NEXT_PUBLIC_TICKETING_BASE_URL || 'http://localhost:5000/api/v1/ticketing';
    const res = await axios.delete(
        `${ticketingUrl}/${id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
        }
    );

    return res.data;
}
