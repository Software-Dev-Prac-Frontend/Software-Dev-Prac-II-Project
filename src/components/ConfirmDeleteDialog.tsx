"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ConfirmDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
}

export default function ConfirmDeleteDialog({
    open,
    onClose,
    onConfirm,
    message = "Are you sure you want to delete this item?",
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
            <Typography>
            {message}
            </Typography>
        </DialogContent>

        <DialogActions>
            <Button variant="outlined" onClick={onClose}>
            Cancel
            </Button>

            <Button variant="contained" color="error" onClick={onConfirm}>
            Delete
            </Button>
        </DialogActions>
        </Dialog>
    );
}
