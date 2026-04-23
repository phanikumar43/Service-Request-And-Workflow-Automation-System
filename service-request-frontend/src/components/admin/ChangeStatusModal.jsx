import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Box
} from '@mui/material';

/**
 * Modal for changing request status
 */
const ChangeStatusModal = ({ open, onClose, request, onSubmit }) => {
    const [status, setStatus] = React.useState('');
    const [notes, setNotes] = React.useState('');

    React.useEffect(() => {
        if (request) {
            setStatus(request.status || '');
            setNotes('');
        }
    }, [request]);

    const handleSubmit = () => {
        onSubmit(request.id, status, notes);
        handleClose();
    };

    const handleClose = () => {
        setStatus('');
        setNotes('');
        onClose();
    };

    if (!request) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Change Status - {request.ticketId}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Status: <strong>{request.status}</strong>
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>New Status</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="New Status"
                        >
                            <MenuItem value="NEW">New</MenuItem>
                            <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
                            <MenuItem value="APPROVED">Approved</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                            <MenuItem value="ASSIGNED">Assigned</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                            <MenuItem value="CLOSED">Closed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Notes / Resolution"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{ mt: 2 }}
                        required={status === 'RESOLVED' || status === 'CLOSED'}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!status || status === request.status}
                >
                    Update Status
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeStatusModal;
