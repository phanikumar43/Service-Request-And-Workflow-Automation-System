import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    PlayArrow as StartIcon,
    CheckCircle as ResolveIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DepartmentDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resolveDialog, setResolveDialog] = useState({ open: false, requestId: null });
    const [resolutionNotes, setResolutionNotes] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await api.get('/department/assigned-requests');
            setRequests(response.data.content || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Failed to load assigned requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStartWork = async (requestId) => {
        try {
            await api.put(`/department/requests/${requestId}/status`, {
                status: 'IN_PROGRESS',
                notes: 'Work started by department user'
            });
            fetchRequests();
        } catch (err) {
            console.error('Error starting work:', err);
            alert('Failed to update status');
        }
    };

    const handleResolveClick = (requestId) => {
        setResolveDialog({ open: true, requestId });
        setResolutionNotes('');
    };

    const handleResolveSubmit = async () => {
        if (!resolutionNotes.trim()) {
            alert("Please provide resolution notes");
            return;
        }

        try {
            await api.put(`/department/requests/${resolveDialog.requestId}/resolve`, {
                resolutionNotes
            });
            setResolveDialog({ open: false, requestId: null });
            fetchRequests();
        } catch (err) {
            console.error('Error resolving request:', err);
            alert('Failed to resolve request');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ASSIGNED': return 'info';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    if (loading && requests.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Department Dashboard
                </Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    variant="outlined"
                    onClick={fetchRequests}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Requester</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No assigned requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>#{request.id}</TableCell>
                                    <TableCell>{request.title}</TableCell>
                                    <TableCell>{request.categoryName}</TableCell>
                                    <TableCell>{request.userName}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={request.priority}
                                            size="small"
                                            color={request.priority === 'HIGH' || request.priority === 'CRITICAL' ? 'error' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={request.status}
                                            color={getStatusColor(request.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            {request.status === 'ASSIGNED' && (
                                                <Tooltip title="Start Work">
                                                    <IconButton color="primary" onClick={() => handleStartWork(request.id)}>
                                                        <StartIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {(request.status === 'IN_PROGRESS' || request.status === 'ASSIGNED') && (
                                                <Tooltip title="Resolve">
                                                    <IconButton color="success" onClick={() => handleResolveClick(request.id)}>
                                                        <ResolveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {/* Add View Details if needed, reusing ViewDetailsModal */}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Resolve Dialog */}
            <Dialog open={resolveDialog.open} onClose={() => setResolveDialog({ ...resolveDialog, open: false })}>
                <DialogTitle>Resolve Request #{resolveDialog.requestId}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Resolution Notes"
                        fullWidth
                        multiline
                        rows={4}
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResolveDialog({ ...resolveDialog, open: false })}>Cancel</Button>
                    <Button onClick={handleResolveSubmit} variant="contained" color="primary">
                        Resolve Request
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DepartmentDashboard;
