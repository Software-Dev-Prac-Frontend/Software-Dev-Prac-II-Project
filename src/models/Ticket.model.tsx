export interface Ticket {
    _id: string;
    user: string;
    event: {
        _id: string;
        name: string;
        description: string;
        eventDate: string;
        venue: string;
        availableTicket: number;
    };
    ticketAmount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ResponseGetTickets {
    success: boolean;
    count: number;
    data: Ticket[];
}

