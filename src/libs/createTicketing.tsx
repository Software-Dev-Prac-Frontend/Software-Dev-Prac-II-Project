import axios from "axios";

export async function createTicketing(eventId: string, amount: number, token: string) {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/v1/ticketing/",
      {
        event: eventId,
        ticketAmount: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Something went wrong";
    throw new Error(message);
  }
}
