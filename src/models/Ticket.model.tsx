import { EventModel } from "./Event.model";
import { User } from "./User.model";

export interface Ticket{
    _id: string;
    User: User;
    Event: EventModel;
}

export interface ResponseGetTickets{
    success: boolean;
    count: number;
    data: Ticket[];
}

