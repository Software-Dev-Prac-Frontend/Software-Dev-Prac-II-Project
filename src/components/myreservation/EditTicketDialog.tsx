"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (amount: number) => void;
    defaultAmount: number;
}

export default function EditTicketDialog({ open, onClose, onSave, defaultAmount }: Props) {
    const [amount, setAmount] = useState(defaultAmount);

    useEffect(() => {
        setAmount(defaultAmount);
    }, [defaultAmount]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Edit Ticket Amount</DialogTitle>

        <DialogContent>
            <Box mt={1}>
            <TextField
                fullWidth
                label="Ticket Amount"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose} color="inherit">Cancel</Button>
            <Button onClick={() => onSave(amount)} variant="contained">Save</Button>
        </DialogActions>
        </Dialog>
    );
}
