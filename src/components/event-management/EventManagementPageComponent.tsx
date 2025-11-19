"use client";

import { useState, useEffect } from 'react';
import { Box, Container, Alert, CircularProgress, TextField, MenuItem, Button } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { EventModel } from '@/models/Event.model';
import { fetchAllEvents, createEvent, updateEvent, deleteEvent } from '@/libs/eventApi';
import { searchEventsByNameVenueOrganizer, filterEventsByDateRange, filterEventsByTicketAvailability } from '@/libs/searchFilterUtils';
import { useAlert } from '@/contexts/AlertContext';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import EventFormDialog from './EventFormDialog';
import EventsTable from './EventsTable';
import EventManagementHeader from './EventManagementHeader';

const DELETE_CONFIRMATION_MESSAGE = 'Are you sure you want to delete this event?';

// Sub-components
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

export default function EventManagementPageComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showAlert } = useAlert();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'soldout'>('all');


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

  useEffect(() => {
    let result = [...events];
    result = searchEventsByNameVenueOrganizer(result, searchTerm);
    result = filterEventsByDateRange(result, startDate || null, endDate || null);
    result = filterEventsByTicketAvailability(result, availabilityFilter);
    setFilteredEvents(result);
  }, [events, searchTerm, startDate, endDate, availabilityFilter]);

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

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <TextField
          label="Search by name, venue, or organizer"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          sx={{ flex: 1, minWidth: 250 }}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <TextField
          select
          label="Availability"
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'soldout')}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="soldout">Sold Out</MenuItem>
        </TextField>
        {(searchTerm || startDate || endDate) && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSearchTerm('');
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {loading ? (
        <LoadingState />
      ) : filteredEvents.length === 0 ? (
        <EmptyState />
      ) : (
        <EventsTable events={filteredEvents} onEdit={handleOpenDialog} onDelete={askDeleteEvent} />
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
        message={DELETE_CONFIRMATION_MESSAGE}
      />
    </Container>
  );
}