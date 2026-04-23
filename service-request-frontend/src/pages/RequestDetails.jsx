import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Button,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle,
    Cancel,
    Pending,
    Assignment,
    Schedule
} from '@mui/icons-material';
import requestService from '../services/requestService';

const statusIcons = {
    NEW: <Assignment />,
    PENDING_APPROVAL: <Pending />,
    APPROVED: <CheckCircle />,
    REJECTED: <Cancel />,
    ASSIGNED: <Assignment />,
    IN_PROGRESS: <Schedule />,
    RESOLVED: <CheckCircle />,
    CLOSED: <CheckCircle />,
    CANCELLED: <Cancel />
};

const statusColors = {
    NEW: 'info',
    PENDING_APPROVAL: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
    ASSIGNED: 'primary',
    IN_PROGRESS: 'secondary',
    RESOLVED: 'success',
    CLOSED: 'default',
    CANCELLED: 'error'
};

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequest();
    }, [id]);

    const loadRequest = async () => {
        try {
            const data = await requestService.getRequestById(id);
            setRequest(data);
        } catch (err) {
            console.error('Error loading request:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container>
                <Box sx={{ mt: 4 }}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    if (!request) {
        return (
            <Container>
                <Box sx={{ mt: 4 }}>
                    <Typography>Request not found</Typography>
                    <Button onClick={() => navigate('/my-requests')} sx={{ mt: 2 }}>
                        Back to Requests
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/my-requests')}
                    sx={{ mb: 2 }}
                >
                    Back to Requests
                </Button>

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                <Typography variant="h5">
                                    {request.title}
                                </Typography>
                                <Chip
                                    label={request.status.replace(/_/g, ' ')}
                                    color={statusColors[request.status]}
                                    icon={statusIcons[request.status]}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Ticket ID
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {request.ticketId}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Priority
                            </Typography>
                            <Chip
                                label={request.priority}
                                color={request.priority === 'CRITICAL' || request.priority === 'HIGH' ? 'error' : 'warning'}
                                sx={{ mt: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Service
                            </Typography>
                            <Typography variant="body1">
                                {request.service?.name || '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Category
                            </Typography>
                            <Typography variant="body1">
                                {request.service?.category?.name || '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Created
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(request.createdAt)}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Last Updated
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(request.updatedAt)}
                            </Typography>
                        </Grid>

                        {request.assignedTo && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Assigned To
                                </Typography>
                                <Typography variant="body1">
                                    {request.assignedTo.firstName} {request.assignedTo.lastName}
                                </Typography>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Description
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                    {request.description}
                                </Typography>
                            </Paper>
                        </Grid>

                        {request.resolutionNotes && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Resolution Notes
                                </Typography>
                                <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                        {request.resolutionNotes}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Paper>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Request Timeline
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Assignment sx={{ mr: 1, color: '#1976d2' }} />
                                    <Typography variant="h6">Request Created</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(request.createdAt)}
                                </Typography>
                                <Typography variant="body2">
                                    Request submitted by {request.requester?.firstName} {request.requester?.lastName}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    {statusIcons[request.status]}
                                    <Typography variant="h6" sx={{ ml: 1 }}>
                                        {request.status.replace(/_/g, ' ')}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(request.updatedAt)}
                                </Typography>
                                <Typography variant="body2">
                                    Current status
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RequestDetails;
