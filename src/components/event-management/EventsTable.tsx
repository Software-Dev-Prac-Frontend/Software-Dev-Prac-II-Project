import { EventModel } from "@/models/Event.model";
import { TableContainer, Paper, Table } from "@mui/material";
import EventTableBody from "./EventTableBody";
import EventTableHead from "./EventTableHead";

interface EventsTableProps {
    events: EventModel[];
    onEdit: (event: EventModel) => void;
    onDelete: (id: string) => void;
}

export default function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
    return (
        <TableContainer component={Paper}>
        <Table>
            <EventTableHead />
            <EventTableBody events={events} onEdit={onEdit} onDelete={onDelete} />
        </Table>
        </TableContainer>
    );
}