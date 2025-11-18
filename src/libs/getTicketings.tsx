import axios from "axios";

export async function getTicketings(token: string) {
    try {
        const res = await axios.get(
        "http://localhost:5000/api/v1/ticketing/",
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
