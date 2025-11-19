import { formatEventDate } from "@/libs/eventValidation";
import { EventModel } from "@/models/Event.model";
import { TableRow, TableCell, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface EventTableRowProps {
    event: EventModel;
    onEdit: (event: EventModel) => void;
    onDelete: (id: string) => void;
}

export default function EventTableRow({ event, onEdit, onDelete }: EventTableRowProps) {
    return (
        <TableRow>
        <TableCell>{event.name}</TableCell>
        <TableCell>{formatEventDate(event.eventDate)}</TableCell>
        <TableCell>{event.venue}</TableCell>
        <TableCell>{event.organizer}</TableCell>
        <TableCell>{event.availableTicket}</TableCell>
        <TableCell align="right">
            <IconButton
            size="small"
            onClick={() => onEdit(event)}
            title="Edit event"
            >
            <EditIcon />
            </IconButton>
            <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(event._id)}
            title="Delete event"
            >
            <DeleteIcon />
            </IconButton>
        </TableCell>
        </TableRow>
    );
}
