import axios from "axios";

export async function deleteTicketing(id: string, token: string) {
    const res = await axios.delete(
        `http://localhost:5000/api/v1/ticketing/${id}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
        }
    );

    return res.data;
}
