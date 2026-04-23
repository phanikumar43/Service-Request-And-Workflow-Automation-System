import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import adminRequestService from '../../services/adminRequestService';

/**
 * Modal for assigning an agent to a request
 */
const AssignAgentModal = ({ open, onClose, request, onAssign }) => {
    const [agents, setAgents] = useState([]);
    const [selectedAgentId, setSelectedAgentId] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && request) {
            loadAgents();
            // Pre-select current agent if exists
            if (request?.assignedAgentId) {
                setSelectedAgentId(request.assignedAgentId);
            } else {
                setSelectedAgentId('');
            }
            setNotes('');
            setError('');
        }
    }, [open, request]);

    const loadAgents = async () => {
        if (!request || !request.departmentId) {
            setError('Request is not assigned to a department. Assign department first.');
            setAgents([]);
            return;
        }

        setLoading(true);
        try {
            const agentUsers = await adminRequestService.getAgentsByDepartment(request.departmentId);
            setAgents(agentUsers);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load agents');
            // console.error('Error loading agents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!selectedAgentId) {
            setError('Please select an agent');
            return;
        }
        onAssign(request.id, selectedAgentId, notes);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Assign Agent to Request</DialogTitle>
            <DialogContent>
                {request && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        <strong>Request:</strong> {request.ticketId} - {request.title}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <TextField
                            select
                            fullWidth
                            label="Select Agent"
                            value={selectedAgentId}
                            onChange={(e) => setSelectedAgentId(e.target.value)}
                            margin="normal"
                            required
                        >
                            <MenuItem value="">
                                <em>Select an agent...</em>
                            </MenuItem>
                            {agents.map((agent) => (
                                <MenuItem key={agent.id} value={agent.id}>
                                    {agent.username} - {agent.email}
                                    {agent.department && ` (${agent.department})`}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Notes (Optional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                            placeholder="Add any notes about this assignment..."
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!selectedAgentId || loading}
                >
                    Assign Agent
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignAgentModal;
