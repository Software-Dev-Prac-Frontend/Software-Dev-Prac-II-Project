import { TABLE_HEADERS } from "@/libs/eventConstants";
import { TableHead, TableRow, TableCell } from "@mui/material";

export default function EventTableHead() {
    return (
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
        <TableRow>
            {TABLE_HEADERS.map(header => (
            <TableCell
                key={header.key}
                align={header.align}
            >
                <strong>{header.label}</strong>
            </TableCell>
            ))}
        </TableRow>
        </TableHead>
    );
}