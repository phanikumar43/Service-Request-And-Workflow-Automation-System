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
 * Modal for changing request priority
 */
const ChangePriorityModal = ({ open, onClose, request, onSubmit }) => {
    const [priority, setPriority] = React.useState('');
    const [notes, setNotes] = React.useState('');

    React.useEffect(() => {
        if (request) {
            setPriority(request.priority || '');
            setNotes('');
        }
    }, [request]);

    const handleSubmit = () => {
        onSubmit(request.id, priority, notes);
        handleClose();
    };

    const handleClose = () => {
        setPriority('');
        setNotes('');
        onClose();
    };

    if (!request) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Change Priority - {request.ticketId}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Priority: <strong>{request.priority}</strong>
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>New Priority</InputLabel>
                        <Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            label="New Priority"
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="CRITICAL">Critical</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Notes (Optional)"
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
                    disabled={!priority || priority === request.priority}
                >
                    Update Priority
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePriorityModal;
