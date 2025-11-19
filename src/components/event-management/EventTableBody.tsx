import { EventModel } from "@/models/Event.model";
import { TableBody } from "@mui/material";
import EventTableRow from "./EventTableRow";

interface EventTableBodyProps {
    events: EventModel[];
    onEdit: (event: EventModel) => void;
    onDelete: (id: string) => void;
}

export default function EventTableBody({ events, onEdit, onDelete }: EventTableBodyProps) {
    return (
        <TableBody>
        {events.map((eventItem) => (
            <EventTableRow
            key={eventItem._id}
            event={eventItem}
            onEdit={onEdit}
            onDelete={onDelete}
            />
        ))}
        </TableBody>
    );
}