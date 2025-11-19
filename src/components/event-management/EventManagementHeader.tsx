import { Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface EventManagementHeaderProps {
    onCreateClick: () => void;
}

export default function EventManagementHeader({ onCreateClick }: EventManagementHeaderProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1 style={{ color: 'black' }}>Event Management</h1>
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
        >
            Create Event
        </Button>
        </Box>
    );
}