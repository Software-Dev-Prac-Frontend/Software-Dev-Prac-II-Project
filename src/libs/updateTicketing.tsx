import axios from "axios";

export async function updateTicketing(id: string, amount: number, token: string) {
    const res = await axios.put(
        `http://localhost:5000/api/v1/ticketing/${id}`,
        { ticketAmount: amount },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    return res.data;
}
