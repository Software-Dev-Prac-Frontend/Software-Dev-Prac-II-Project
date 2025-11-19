"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert, CircularProgress, TextField, MenuItem, Collapse } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ReservationForm from './ReservationForm';
import { Ticket } from '@/models/Ticket.model';
import { formatEventDate } from '@/libs/eventValidation';
import { searchReservations, filterReservationsByEventDateRange, filterReservationsByRequestedDateRange, filterReservationsByTicketAmount } from '@/libs/searchFilterUtils';
import { useAlert } from '@/contexts/AlertContext';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';

const RESERVATION_API_BASE = process.env.NEXT_PUBLIC_TICKETING_BASE_URL || 'http://localhost:5000/api/v1/ticketing';
const DELETE_CONFIRMATION = 'Are you sure you want to delete this reservation?';

export default function ReservationManagementPageComponent() {
  const { user } = useAuth();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [reservations, setReservations] = useState<Ticket[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Ticket | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandFilters, setExpandFilters] = useState(false);
  const [eventDateStart, setEventDateStart] = useState<string>('');
  const [eventDateEnd, setEventDateEnd] = useState<string>('');
  const [requestedDateStart, setRequestedDateStart] = useState<string>('');
  const [requestedDateEnd, setRequestedDateEnd] = useState<string>('');
  const [minTicketAmount, setMinTicketAmount] = useState<number | null>(null);
  const [maxTicketAmount, setMaxTicketAmount] = useState<number | null>(null);

  const handleAskDelete = (id: string) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

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

  useEffect(() => {
    let result = [...reservations];
    result = searchReservations(result, searchTerm);
    result = filterReservationsByEventDateRange(result, eventDateStart || null, eventDateEnd || null);
    result = filterReservationsByRequestedDateRange(result, requestedDateStart || null, requestedDateEnd || null);
    result = filterReservationsByTicketAmount(result, minTicketAmount, maxTicketAmount);
    setFilteredReservations(result);
  }, [reservations, searchTerm, eventDateStart, eventDateEnd, requestedDateStart, requestedDateEnd, minTicketAmount, maxTicketAmount]);

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
      showAlert("Reservation updated successfully!", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reservation');
      showAlert(err instanceof Error ? err.message : 'Failed to update reservation', "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${RESERVATION_API_BASE}/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete reservation');

      showAlert("Reservation deleted successfully!", "success");
      await loadReservations();
    } catch (err) {
      showAlert(err instanceof Error ? err.message : 'Failed to delete reservation', "error");
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1 style={{ color: 'black' }}>Reservation Management</h1>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search reservations"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="User name, event, venue..."
          sx={{ flex: 1, minWidth: 250 }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => setExpandFilters(!expandFilters)}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          Filter by Date & Ticket Amount
          {expandFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
      </Box>

      <Collapse in={expandFilters}>
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box>
              <Box sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1, color: '#666' }}>Event Date From</Box>
              <TextField
                type="date"
                label="Start Date"
                size="small"
                value={eventDateStart}
                onChange={(e) => setEventDateStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box>
              <Box sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1, color: '#666' }}>Event Date To</Box>
              <TextField
                type="date"
                label="End Date"
                size="small"
                value={eventDateEnd}
                onChange={(e) => setEventDateEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box>
              <Box sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1, color: '#666' }}>Requested Date From</Box>
              <TextField
                type="date"
                label="Start Date"
                size="small"
                value={requestedDateStart}
                onChange={(e) => setRequestedDateStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box>
              <Box sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1, color: '#666' }}>Requested Date To</Box>
              <TextField
                type="date"
                label="End Date"
                size="small"
                value={requestedDateEnd}
                onChange={(e) => setRequestedDateEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '100%' }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              type="number"
              label="Min Ticket Amount"
              size="small"
              value={minTicketAmount === null ? '' : minTicketAmount}
              onChange={(e) => setMinTicketAmount(e.target.value === '' ? null : parseInt(e.target.value, 10))}
              inputProps={{ min: 0 }}
              sx={{ width: '100%' }}
            />
            <TextField
              type="number"
              label="Max Ticket Amount"
              size="small"
              value={maxTicketAmount === null ? '' : maxTicketAmount}
              onChange={(e) => setMaxTicketAmount(e.target.value === '' ? null : parseInt(e.target.value, 10))}
              inputProps={{ min: 0 }}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setEventDateStart('');
                setEventDateEnd('');
                setRequestedDateStart('');
                setRequestedDateEnd('');
                setMinTicketAmount(null);
                setMaxTicketAmount(null);
              }}
            >
              Clear All Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredReservations.length === 0 ? (
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
              {filteredReservations.map((reservation) => (
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
                      onClick={() => handleAskDelete(reservation._id)}
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
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        message={DELETE_CONFIRMATION}
      />
    </Container>
  );
}
