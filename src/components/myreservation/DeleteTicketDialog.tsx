"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteTicketDialog({ open, onClose, onConfirm }: Props) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Delete Reservation</DialogTitle>

        <DialogContent>
            <Typography>
            Are you sure you want to delete this reservation?
            </Typography>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose} color="inherit">Cancel</Button>
            <Button onClick={onConfirm} variant="contained" color="error">
            Delete
            </Button>
        </DialogActions>
        </Dialog>
    );
}
