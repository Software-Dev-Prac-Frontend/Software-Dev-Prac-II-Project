"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ReservationForm from './ReservationForm';
import { Ticket } from '@/models/Ticket.model';
import { formatEventDate } from '@/libs/eventValidation';

const RESERVATION_API_BASE = 'http://localhost:5000/api/v1/ticketing';
const DELETE_CONFIRMATION = 'Are you sure you want to delete this reservation?';

export default function ReservationManagementPageComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Ticket | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  // Fetch reservations
  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(RESERVATION_API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reservations');
      const data = await response.json();
      setReservations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleOpenDialog = (reservation?: Ticket) => {
    if (reservation) {
      setSelectedReservation(reservation);
    } else {
      setSelectedReservation(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
  };

  const handleSaveReservation = async (ticketAmount: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!selectedReservation) return;

      const response = await fetch(`${RESERVATION_API_BASE}/${selectedReservation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update reservation');
      }

      await loadReservations();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reservation');
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!window.confirm(DELETE_CONFIRMATION)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${RESERVATION_API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete reservation');

      await loadReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete reservation');
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1 style={{ color: 'black' }}>Reservation Management</h1>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : reservations.length === 0 ? (
        <Alert severity="info">No reservations found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Event Name</strong></TableCell>
                <TableCell><strong>Event Date</strong></TableCell>
                <TableCell><strong>Venue</strong></TableCell>
                <TableCell><strong>Ticket Amount</strong></TableCell>
                <TableCell><strong>Requested Date</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation._id}>
                  <TableCell>
                    {typeof reservation.user === 'string'
                      ? reservation.user
                      : (reservation.user as any)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>{reservation.event.name}</TableCell>
                  <TableCell>{formatEventDate(reservation.event.eventDate)}</TableCell>
                  <TableCell>{reservation.event.venue}</TableCell>
                  <TableCell>{reservation.ticketAmount}</TableCell>
                  <TableCell>{formatEventDate(reservation.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(reservation)}
                      title="Edit reservation"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteReservation(reservation._id)}
                      title="Delete reservation"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Reservation</DialogTitle>
        <DialogContent>
          <ReservationForm
            reservation={selectedReservation}
            onSave={handleSaveReservation}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
