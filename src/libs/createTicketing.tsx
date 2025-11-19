import axios from "axios";

export async function createTicketing(eventId: string, amount: number, token: string) {
  try {
    const ticketingUrl = process.env.NEXT_PUBLIC_TICKETING_BASE_URL || 'http://localhost:5000/api/v1/ticketing';
    const res = await axios.post(
      `${ticketingUrl}/`,
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
