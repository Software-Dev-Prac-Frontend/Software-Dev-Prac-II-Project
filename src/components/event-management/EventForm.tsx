"use client";

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Stack } from '@mui/material';
import { EventModel } from '@/models/Event.model';
import { validateEventForm, getTodayDateForInput } from '@/libs/eventValidation';
import { FORM_FIELDS } from '@/libs/eventConstants';

interface EventFormProps {
  event?: EventModel | null;
  onSave: (formData: Omit<EventModel, '_id'>) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

interface FormDataType {
  [FORM_FIELDS.NAME]: string;
  [FORM_FIELDS.DESCRIPTION]: string;
  [FORM_FIELDS.EVENT_DATE]: string;
  [FORM_FIELDS.VENUE]: string;
  [FORM_FIELDS.ORGANIZER]: string;
  [FORM_FIELDS.AVAILABLE_TICKET]: string;
  [FORM_FIELDS.POSTER_PICTURE]: string;
}

const INITIAL_FORM_DATA: FormDataType = {
  [FORM_FIELDS.NAME]: '',
  [FORM_FIELDS.DESCRIPTION]: '',
  [FORM_FIELDS.EVENT_DATE]: '',
  [FORM_FIELDS.VENUE]: '',
  [FORM_FIELDS.ORGANIZER]: '',
  [FORM_FIELDS.AVAILABLE_TICKET]: '',
  [FORM_FIELDS.POSTER_PICTURE]: '',
};

export default function EventForm({ event, onSave, onCancel, isCreating }: EventFormProps) {
  const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event && !isCreating) {
      setFormData({
        [FORM_FIELDS.NAME]: event.name,
        [FORM_FIELDS.DESCRIPTION]: event.description || '',
        [FORM_FIELDS.EVENT_DATE]: new Date(event.eventDate).toISOString().split('T')[0],
        [FORM_FIELDS.VENUE]: event.venue,
        [FORM_FIELDS.ORGANIZER]: event.organizer,
        [FORM_FIELDS.AVAILABLE_TICKET]: String(event.availableTicket),
        [FORM_FIELDS.POSTER_PICTURE]: event.posterPicture || '',
      });
    }
  }, [event, isCreating]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateEventForm({
      name: formData[FORM_FIELDS.NAME],
      eventDate: formData[FORM_FIELDS.EVENT_DATE],
      venue: formData[FORM_FIELDS.VENUE],
      organizer: formData[FORM_FIELDS.ORGANIZER],
      availableTicket: formData[FORM_FIELDS.AVAILABLE_TICKET],
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        [FORM_FIELDS.AVAILABLE_TICKET]: Number(formData[FORM_FIELDS.AVAILABLE_TICKET]),
      } as Omit<EventModel, '_id'>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const minDate = getTodayDateForInput();

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Stack spacing={2}>
        {error && (
          <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>
            {error}
          </Box>
        )}

        <TextField
          label="Event Name"
          name={FORM_FIELDS.NAME}
          value={formData[FORM_FIELDS.NAME]}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
        />

        <TextField
          label="Description"
          name={FORM_FIELDS.DESCRIPTION}
          value={formData[FORM_FIELDS.DESCRIPTION]}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          disabled={loading}
        />

        <TextField
          label="Event Date"
          name={FORM_FIELDS.EVENT_DATE}
          type="date"
          value={formData[FORM_FIELDS.EVENT_DATE]}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: minDate }}
          helperText="Event date must be today or a future date"
        />

        <TextField
          label="Venue"
          name={FORM_FIELDS.VENUE}
          value={formData[FORM_FIELDS.VENUE]}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
        />

        <TextField
          label="Organizer"
          name={FORM_FIELDS.ORGANIZER}
          value={formData[FORM_FIELDS.ORGANIZER]}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
        />

        <TextField
          label="Available Tickets"
          name={FORM_FIELDS.AVAILABLE_TICKET}
          type="number"
          value={formData[FORM_FIELDS.AVAILABLE_TICKET]}
          onChange={handleChange}
          fullWidth
          required
          disabled={loading}
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Poster Picture URL"
          name={FORM_FIELDS.POSTER_PICTURE}
          value={formData[FORM_FIELDS.POSTER_PICTURE]}
          onChange={handleChange}
          fullWidth
          disabled={loading}
          helperText="Use direct image URLs or Google Drive sharing links"
        />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Event'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
