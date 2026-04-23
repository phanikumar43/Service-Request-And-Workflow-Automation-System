import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    IconButton
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import approvalService from '../services/approvalService';
import { useAuth } from '../context/AuthContext';

const ApproverDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        loadApprovals();
    }, []);

    const loadApprovals = async () => {
        try {
            const data = await approvalService.getPendingApprovals();
            setApprovals(data);
        } catch (err) {
            console.error('Error loading approvals:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (approval, type) => {
        setSelectedApproval(approval);
        setActionType(type);
        setDialogOpen(true);
    };

    const handleSubmitAction = async () => {
        try {
            if (actionType === 'approve') {
                await approvalService.approveRequest(selectedApproval.id, comments);
            } else {
                await approvalService.rejectRequest(selectedApproval.id, comments);
            }
            setDialogOpen(false);
            setComments('');
            loadApprovals();
        } catch (err) {
            console.error('Error processing approval:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4">
                            Approver Dashboard
                        </Typography>
                        <Button variant="outlined" color="error" onClick={logout}>
                            Logout
                        </Button>
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Pending Approvals ({approvals.length})
                    </Typography>

                    <TableContainer sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ticket ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Requester</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Submitted</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : approvals.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No pending approvals
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    approvals.map((approval) => (
                                        <TableRow key={approval.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {approval.request?.ticketId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{approval.request?.title}</TableCell>
                                            <TableCell>
                                                {approval.request?.requester?.firstName} {approval.request?.requester?.lastName}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={approval.request?.priority}
                                                    color={approval.request?.priority === 'CRITICAL' ? 'error' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(approval.createdAt)}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => navigate(`/request/${approval.request?.id}`)}
                                                    title="View Details"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleAction(approval, 'approve')}
                                                    title="Approve"
                                                >
                                                    <CheckCircle />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleAction(approval, 'reject')}
                                                    title="Reject"
                                                >
                                                    <Cancel />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Approval Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder={actionType === 'approve' ? 'Optional approval comments' : 'Please provide reason for rejection'}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color={actionType === 'approve' ? 'success' : 'error'}
                        onClick={handleSubmitAction}
                    >
                        {actionType === 'approve' ? 'Approve' : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ApproverDashboard;
