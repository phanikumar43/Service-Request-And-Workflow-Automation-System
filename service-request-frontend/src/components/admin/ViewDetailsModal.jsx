import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    Paper
} from '@mui/material';
import { format } from 'date-fns';

/**
 * Modal for viewing comprehensive request details
 */
const ViewDetailsModal = ({ open, onClose, requestDetails }) => {
    if (!requestDetails) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch (error) {
            return dateString;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'info';
            case 'PENDING_APPROVAL': return 'warning';
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'ASSIGNED': return 'primary';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Request Details - {requestDetails.ticketId}
            </DialogTitle>
            <DialogContent dividers>
                {/* Request Info */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Request Information</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                            label={requestDetails.priority}
                            color={getPriorityColor(requestDetails.priority)}
                            size="small"
                        />
                        <Chip
                            label={requestDetails.status}
                            color={getStatusColor(requestDetails.status)}
                            size="small"
                        />
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Title:</strong> {requestDetails.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Description:</strong> {requestDetails.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Category:</strong> {requestDetails.categoryName || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Type:</strong> {requestDetails.typeName || 'N/A'}
                    </Typography>
                </Box>

                <Divider />

                {/* Requester Info */}
                <Box sx={{ my: 3 }}>
                    <Typography variant="h6" gutterBottom>Requester Information</Typography>
                    <Typography variant="body2"><strong>Name:</strong> {requestDetails.requesterName}</Typography>
                    <Typography variant="body2"><strong>Email:</strong> {requestDetails.requesterEmail}</Typography>
                    <Typography variant="body2"><strong>Phone:</strong> {requestDetails.requesterPhone || 'N/A'}</Typography>
                    <Typography variant="body2"><strong>Department:</strong> {requestDetails.requesterDepartment || 'N/A'}</Typography>
                </Box>

                <Divider />

                {/* Assignment Info */}
                <Box sx={{ my: 3 }}>
                    <Typography variant="h6" gutterBottom>Assignment</Typography>
                    <Typography variant="body2">
                        <strong>Department:</strong> {requestDetails.departmentName || 'Unassigned'}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Assigned Agent:</strong> {requestDetails.assignedAgentName || 'Unassigned'}
                    </Typography>
                    {requestDetails.assignedAgentEmail && (
                        <Typography variant="body2">
                            <strong>Agent Email:</strong> {requestDetails.assignedAgentEmail}
                        </Typography>
                    )}
                </Box>

                <Divider />

                {/* Activity Log */}
                <Box sx={{ my: 3 }}>
                    <Typography variant="h6" gutterBottom>Activity Timeline</Typography>
                    {requestDetails.activityLog && requestDetails.activityLog.length > 0 ? (
                        <List>
                            {requestDetails.activityLog.map((activity) => (
                                <ListItem key={activity.id} alignItems="flex-start" sx={{ borderLeft: '3px solid #1976d2', mb: 2, bgcolor: 'background.paper' }}>
                                    <ListItemText
                                        primary={
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {activity.actionType.replace(/_/g, ' ')}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(activity.createdAt)} • By: {activity.performedBy}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                {activity.newValue && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {activity.newValue}
                                                    </Typography>
                                                )}
                                                {activity.notes && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                        Notes: {activity.notes}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No activity recorded yet.
                        </Typography>
                    )}
                </Box>

                <Divider />

                {/* Timestamps */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Created:</strong> {formatDate(requestDetails.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Last Updated:</strong> {formatDate(requestDetails.updatedAt)}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewDetailsModal;
