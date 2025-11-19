"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { updateTicketing } from "@/libs/updateTicketing";
import { deleteTicketing } from "@/libs/deleteTicketing";
import EditTicketDialog from "@/components/myreservation/EditTicketDialog";
import DeleteTicketDialog from "./DeleteTicketDialog";
import { useAlert } from "@/contexts/AlertContext";

type EventType = {
    _id: string;
    name: string;
    description: string;
    eventDate: string;
    venue: string;
    availableTicket: number;
};

type Ticketing = {
    _id: string;
    ticketAmount: number;
    createdAt: string;
    event: EventType;
};

export default function ReservationDetail() {
    const [tickets, setTickets] = useState<Ticketing[]>([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [editTicketId, setEditTicketId] = useState("");
    const [editAmount, setEditAmount] = useState(1);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTicketId, setDeleteTicketId] = useState("");
    const { showAlert } = useAlert();

    const openDeletePopup = (id: string) => {
        setDeleteTicketId(id);
        setDeleteOpen(true);
    }; 

    const handleConfirmDelete = async () => {
        try {
            await deleteTicketing(deleteTicketId, token);
            setDeleteOpen(false);
            fetchTicketings();
            showAlert("Reservation deleted successfully!", "error");
        } catch (err: any) {
            showAlert(err.response?.data?.message || "Delete failed", "error");
        }
    };

    const openEditPopup = (id: string, amount: number) => {
        setEditTicketId(id);
        setEditAmount(amount);
        setEditOpen(true);
    };

    const handleSaveEdit = async (newAmount: number) => {
        try {
            await updateTicketing(editTicketId, newAmount, token);
            setEditOpen(false);
            fetchTicketings();
            showAlert("Reservation updated successfully!", "success");
        } catch (err: any) {
            showAlert(err.response?.data?.message || "Update failed", "error");
        }
    };

    useEffect(() => {
        const t = localStorage.getItem("token");
        if (t) setToken(t);
    }, []);

    const fetchTicketings = async () => {
        try {
        const ticketingUrl = process.env.NEXT_PUBLIC_TICKETING_BASE_URL || 'http://localhost:5000/api/v1/ticketing';
        const res = await axios.get(`${ticketingUrl}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setTickets(res.data.data);
        } catch (err: any) {
            console.error("Error fetching ticketings:", err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTicketings();
    }, [token]);
    if(!token){
        return (
        <Typography variant="h6" textAlign="center" mt={4} color="#000">
            Please login to view your reservations.
        </Typography>
        );
    }

    if (loading) {
        return (
        <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
        </Box>
        );
    }

    if (tickets.length === 0) {
        return (
        <Typography variant="h6" textAlign="center" mt={4} color="#000">
            You don't have any reservations yet.
        </Typography>
        );
    }

    return (
        <Box p={3}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="#000">
            My Reservations
        </Typography>

        <Box
            sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            }}
        >
            {tickets.map((ticket) => (
            <Card
                key={ticket._id}
                sx={{
                width: "100%",
                maxWidth: 350,
                borderRadius: 3,
                p: 2,
                flexGrow: 1,
                }}
            >
                <CardContent>
                <Typography variant="h6" fontWeight="bold">
                    {ticket.event.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={1}>
                    {ticket.event.description}
                </Typography>

                <Typography variant="body1" mt={2}>
                    <strong>Date:</strong>{" "}
                    {new Date(ticket.event.eventDate).toLocaleDateString()}
                </Typography>

                <Typography variant="body1">
                    <strong>Venue:</strong> {ticket.event.venue}
                </Typography>

                <Typography variant="body1" mt={1}>
                    <strong>Tickets:</strong> {ticket.ticketAmount}
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={1}>
                    Reserved at: {new Date(ticket.createdAt).toLocaleString()}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                        variant="contained"
                        color="warning"
                        fullWidth
                        onClick={() => openEditPopup(ticket._id, ticket.ticketAmount)}
                        >
                        Edit
                    </Button>

                    <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => openDeletePopup(ticket._id)}
                    >
                    Delete
                    </Button>
                </Box>
                </CardContent>
            </Card>
            ))}
            <EditTicketDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSave={handleSaveEdit}
                defaultAmount={editAmount}
            />
            <DeleteTicketDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </Box>
        </Box>
    );
}
