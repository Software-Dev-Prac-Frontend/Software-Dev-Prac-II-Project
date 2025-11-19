"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import EventForm from './EventForm';
import { EventModel } from '@/models/Event.model';
import { fetchAllEvents, createEvent, updateEvent, deleteEvent } from '@/libs/eventApi';
import { formatEventDate } from '@/libs/eventValidation';
import { TABLE_HEADERS } from '@/libs/eventConstants';
import { useAlert } from '@/contexts/AlertContext';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';

export default function EventManagementPageComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showAlert } = useAlert();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const askDeleteEvent = (id: string) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  }; 

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  // Fetch events
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenDialog = (eventData?: EventModel) => {
    if (eventData) {
      setSelectedEvent(eventData);
      setIsCreating(false);
    } else {
      setSelectedEvent(null);
      setIsCreating(true);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setIsCreating(false);
  };

  const handleSaveEvent = async (formData: Omit<EventModel, '_id'>) => {
    try {
      const token = localStorage.getItem('token');
      
      if (isCreating) {
        await createEvent(formData, token);
      } else if (selectedEvent) {
        await updateEvent(selectedEvent._id, formData, token);
      }

      await loadEvents();
      handleCloseDialog();
      showAlert(`Event ${isCreating ? 'created' : 'updated'} successfully!`, "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
      showAlert(err instanceof Error ? err.message : 'Failed to save event', "error");
    }
  };

  const confirmDeleteEvent = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem('token');
      await deleteEvent(deleteId, token);

      await loadEvents();
      showAlert("Event deleted successfully!", "error");
    } catch (err) {
      showAlert(err instanceof Error ? err.message : 'Failed to delete event', "error");
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };


  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <EventManagementHeader onCreateClick={() => handleOpenDialog()} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <EventsTable events={events} onEdit={handleOpenDialog} onDelete={askDeleteEvent} />
      )}

      <EventFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        event={selectedEvent}
        isCreating={isCreating}
        onSave={handleSaveEvent}
      />
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDeleteEvent}
        message="Are you sure you want to delete this event?"
      />
    </Container>
  );
}

// Sub-components
interface EventManagementHeaderProps {
  onCreateClick: () => void;
}

function EventManagementHeader({ onCreateClick }: EventManagementHeaderProps) {
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

function LoadingState() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );
}

function EmptyState() {
  return <Alert severity="info">No events found. Create your first event!</Alert>;
}

interface EventsTableProps {
  events: EventModel[];
  onEdit: (event: EventModel) => void;
  onDelete: (id: string) => void;
}

function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <EventTableHead />
        <EventTableBody events={events} onEdit={onEdit} onDelete={onDelete} />
      </Table>
    </TableContainer>
  );
}

function EventTableHead() {
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

interface EventTableBodyProps {
  events: EventModel[];
  onEdit: (event: EventModel) => void;
  onDelete: (id: string) => void;
}

function EventTableBody({ events, onEdit, onDelete }: EventTableBodyProps) {
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

interface EventTableRowProps {
  event: EventModel;
  onEdit: (event: EventModel) => void;
  onDelete: (id: string) => void;
}

function EventTableRow({ event, onEdit, onDelete }: EventTableRowProps) {
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

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventModel | null;
  isCreating: boolean;
  onSave: (formData: Omit<EventModel, '_id'>) => Promise<void>;
}

function EventFormDialog({ open, onClose, event, isCreating, onSave }: EventFormDialogProps) {
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
