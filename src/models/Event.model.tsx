export interface EventModel {
    _id: string;
    name: string;
    description: string;
    eventDate: string;
    venue: string;
    organizer: string;
    availableTicket: number;
    posterPicture: string;
    createdAt: string;
    updatedAt: string;
}

export interface ResponseGetEvents {
    success: boolean;
    count: number;
    data: EventModel[];
}