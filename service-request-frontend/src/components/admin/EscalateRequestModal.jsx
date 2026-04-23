import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Alert
} from '@mui/material';

/**
 * Modal for escalating a request
 */
const EscalateRequestModal = ({ open, onClose, request, onSubmit }) => {
    const [reason, setReason] = React.useState('');
    const [notes, setNotes] = React.useState('');

    React.useEffect(() => {
        if (request) {
            setReason('');
            setNotes('');
        }
    }, [request]);

    const handleSubmit = () => {
        const escalationData = {
            reason,
            notes
        };
        onSubmit(request.id, escalationData);
        handleClose();
    };

    const handleClose = () => {
        setReason('');
        setNotes('');
        onClose();
    };

    if (!request) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Escalate Request - {request.ticketId}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Escalating this request will increase its priority and notify management.
                    </Alert>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Title:</strong> {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Current Priority:</strong> {request.priority}
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Escalation Reason *"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{ mt: 2 }}
                        required
                        placeholder="Explain why this request needs to be escalated..."
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Additional Notes (Optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="warning"
                    disabled={!reason.trim()}
                >
                    Escalate Request
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EscalateRequestModal;
