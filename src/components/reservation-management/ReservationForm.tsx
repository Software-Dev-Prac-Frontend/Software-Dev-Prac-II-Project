"use client";

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Stack, Alert } from '@mui/material';
import { Ticket } from '@/models/Ticket.model';

interface ReservationFormProps {
  reservation: Ticket | null;
  onSave: (ticketAmount: number) => Promise<void>;
  onCancel: () => void;
}

const MIN_TICKETS = 1;
const MAX_TICKETS = 5;

export default function ReservationForm({ reservation, onSave, onCancel }: ReservationFormProps) {
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reservation) {
      setTicketAmount(String(reservation.ticketAmount));
    }
  }, [reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const amount = Number(ticketAmount);
    if (!ticketAmount || isNaN(amount)) {
      setError('Ticket amount is required');
      return;
    }

    if (amount < MIN_TICKETS || amount > MAX_TICKETS) {
      setError(`Ticket amount must be between ${MIN_TICKETS} and ${MAX_TICKETS}`);
      return;
    }

    try {
      setLoading(true);
      await onSave(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
          <div><strong>Event:</strong> {reservation?.event.name}</div>
          <div><strong>Venue:</strong> {reservation?.event.venue}</div>
          <div><strong>Available Tickets:</strong> {reservation?.event.availableTicket}</div>
        </Box>

        <TextField
          label="Ticket Amount"
          type="number"
          value={ticketAmount}
          onChange={(e) => setTicketAmount(e.target.value)}
          fullWidth
          required
          disabled={loading}
          inputProps={{ min: MIN_TICKETS, max: MAX_TICKETS }}
          helperText={`Enter a number between ${MIN_TICKETS} and ${MAX_TICKETS}`}
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
            {loading ? 'Saving...' : 'Update Reservation'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
