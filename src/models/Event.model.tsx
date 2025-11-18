export const MODEL_DEFAULT:EventModel = {
    _id: "",
    name: "",
    description: "",
    eventDate: "",
    venue: "",
    organizer: "",
    availableTicket: 0,
    posterPicture: "",
    createdAt: "",
    updatedAt: ""
};

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

export interface EventsJson {
    success: boolean;
    count: number;
    data: EventModel[];
}

export interface EventJson {
    success: boolean;
    data: EventModel;
}