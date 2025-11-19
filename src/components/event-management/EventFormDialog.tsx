import { EventModel } from "@/models/Event.model";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import EventForm from "./EventForm";

interface EventFormDialogProps {
    open: boolean;
    onClose: () => void;
    event: EventModel | null;
    isCreating: boolean;
    onSave: (formData: Omit<EventModel, '_id'>) => Promise<void>;
}

export default function EventFormDialog({ open, onClose, event, isCreating, onSave }: EventFormDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
            {isCreating ? 'Create New Event' : 'Edit Event'}
        </DialogTitle>
        <DialogContent>
            <EventForm
            event={event}
            onSave={onSave}
            onCancel={onClose}
            isCreating={isCreating}
            />
        </DialogContent>
        </Dialog>
    );
}