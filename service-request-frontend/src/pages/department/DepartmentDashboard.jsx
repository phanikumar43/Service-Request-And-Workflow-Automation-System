import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    TablePagination
} from '@mui/material';
import { Visibility, Edit, CheckCircle, ThumbUp, ThumbDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import departmentRequestService from '../../services/departmentRequestService';

const DepartmentDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Action dialogs
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionDialog, setActionDialog] = useState({ open: false, type: '' });
    const [actionNotes, setActionNotes] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        loadRequests();
    }, [currentTab, page, rowsPerPage]);

    const getStatusFilter = () => {
        switch (currentTab) {
            case 1: return 'PENDING_APPROVAL';
            case 2: return 'IN_PROGRESS';
            case 3: return 'RESOLVED';
            case 4: return 'REJECTED';
            default: return '';
        }
    };

    const loadRequests = async () => {
        setLoading(true);
        try {
            const status = getStatusFilter();
            // Force sort by createdAt descending (newest first)
            const filters = {
                status,
                sort: 'createdAt,desc'
            };
            const data = await departmentRequestService.getDepartmentRequests(filters, page, rowsPerPage);
            setRequests(data.content || data.requests || []); // Handle both Page object and custom map
            setTotalItems(data.totalElements || data.totalItems || 0);
        } catch (error) {
            console.error("Failed to load department requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const openActionDialog = (request, type) => {
        setSelectedRequest(request);
        setActionDialog({ open: true, type });
        setNewStatus(request.status);
        setActionNotes('');
        setRejectionReason('');
    };

    const handleActionSubmit = async () => {
        try {
            if (actionDialog.type === 'approve') {
                await departmentRequestService.approveRequest(selectedRequest.id, actionNotes);
            } else if (actionDialog.type === 'reject') {
                if (!rejectionReason.trim()) {
                    alert('Rejection reason is required');
                    return;
                }
                await departmentRequestService.rejectRequest(selectedRequest.id, rejectionReason);
            } else if (actionDialog.type === 'resolve') {
                if (!actionNotes.trim()) {
                    alert('Resolution notes are required');
                    return;
                }
                await departmentRequestService.resolveRequest(selectedRequest.id, actionNotes);
            } else if (actionDialog.type === 'status') {
                await departmentRequestService.updateStatus(selectedRequest.id, newStatus, actionNotes);
            }
            setActionDialog({ open: false, type: '' });
            loadRequests();
        } catch (error) {
            console.error("Failed to update request", error);
            alert("Failed to update request: " + (error.response?.data?.message || error.message));
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'NEW': 'info',
            'PENDING_APPROVAL': 'warning',
            'APPROVED': 'success',
            'REJECTED': 'error',
            'ASSIGNED': 'primary',
            'IN_PROGRESS': 'secondary',
            'WAITING_FOR_USER': 'warning',
            'RESOLVED': 'success',
            'CLOSED': 'default'
        };
        return colors[status] || 'default';
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Department Dashboard
            </Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                    <Tab label="My Bucket (All)" />
                    <Tab label="Pending Approval" />
                    <Tab label="In Progress" />
                    <Tab label="Resolved" />
                    <Tab label="Rejected" />
                </Tabs>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ticket ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Requester</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center">No requests found</TableCell></TableRow>
                            ) : (
                                requests.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.ticketId}</TableCell>
                                        <TableCell>
                                            {req.title}
                                            {req.rejectionReason && (
                                                <Alert severity="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
                                                    Rejected: {req.rejectionReason}
                                                </Alert>
                                            )}
                                        </TableCell>
                                        <TableCell>{req.userName}</TableCell>
                                        <TableCell>
                                            <Chip label={req.priority} size="small" color={req.priority === 'CRITICAL' ? 'error' : 'default'} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={req.status} size="small" color={getStatusColor(req.status)} />
                                        </TableCell>
                                        <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => navigate(`/request/${req.id}`)} title="View Details">
                                                <Visibility />
                                            </IconButton>

                                            {/* Approve/Reject buttons for PENDING_APPROVAL */}
                                            {req.status === 'PENDING_APPROVAL' && (
                                                <>
                                                    <IconButton onClick={() => openActionDialog(req, 'approve')} title="Approve" color="success">
                                                        <ThumbUp />
                                                    </IconButton>
                                                    <IconButton onClick={() => openActionDialog(req, 'reject')} title="Reject" color="error">
                                                        <ThumbDown />
                                                    </IconButton>
                                                </>
                                            )}

                                            {/* Status update and resolve for other statuses */}
                                            {req.status !== 'RESOLVED' && req.status !== 'CLOSED' && req.status !== 'PENDING_APPROVAL' && (
                                                <>
                                                    <IconButton onClick={() => openActionDialog(req, 'status')} title="Update Status">
                                                        <Edit color="secondary" />
                                                    </IconButton>
                                                    <IconButton onClick={() => openActionDialog(req, 'resolve')} title="Resolve">
                                                        <CheckCircle color="success" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalItems}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Action Dialog */}
            <Dialog open={actionDialog.open} onClose={() => setActionDialog({ ...actionDialog, open: false })} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {actionDialog.type === 'approve' && 'Approve Request'}
                    {actionDialog.type === 'reject' && 'Reject Request'}
                    {actionDialog.type === 'resolve' && 'Resolve Request'}
                    {actionDialog.type === 'status' && 'Update Status'}
                </DialogTitle>
                <DialogContent sx={{ minWidth: 400, mt: 1 }}>
                    {/* Approve */}
                    {actionDialog.type === 'approve' && (
                        <TextField
                            label="Approval Notes (Optional)"
                            multiline
                            rows={4}
                            fullWidth
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                            margin="normal"
                            placeholder="Add any notes about the approval..."
                        />
                    )}

                    {/* Reject */}
                    {actionDialog.type === 'reject' && (
                        <TextField
                            label="Rejection Reason *"
                            multiline
                            rows={4}
                            fullWidth
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            margin="normal"
                            required
                            placeholder="Explain why this request is being rejected..."
                            error={!rejectionReason.trim()}
                            helperText={!rejectionReason.trim() ? "Rejection reason is required" : ""}
                        />
                    )}

                    {/* Status Update */}
                    {actionDialog.type === 'status' && (
                        <>
                            <TextField
                                select
                                label="New Status"
                                fullWidth
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                margin="normal"
                            >
                                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                <MenuItem value="WAITING_FOR_USER">Waiting for User</MenuItem>
                                <MenuItem value="RESOLVED">Resolved</MenuItem>
                                <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
                                <MenuItem value="APPROVED">Approved</MenuItem>
                                <MenuItem value="REJECTED">Rejected</MenuItem>
                            </TextField>
                            <TextField
                                label="Comments"
                                multiline
                                rows={4}
                                fullWidth
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                margin="normal"
                                placeholder="Add any work notes..."
                            />
                        </>
                    )}

                    {/* Resolve */}
                    {actionDialog.type === 'resolve' && (
                        <TextField
                            label="Resolution Notes *"
                            multiline
                            rows={4}
                            fullWidth
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                            margin="normal"
                            required
                            placeholder="Explain how the issue was resolved..."
                            error={!actionNotes.trim()}
                            helperText={!actionNotes.trim() ? "Resolution notes are required" : ""}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActionDialog({ ...actionDialog, open: false })}>Cancel</Button>
                    <Button
                        onClick={handleActionSubmit}
                        variant="contained"
                        color={actionDialog.type === 'reject' ? "error" : actionDialog.type === 'approve' ? "success" : "primary"}
                        disabled={
                            (actionDialog.type === 'reject' && !rejectionReason.trim()) ||
                            (actionDialog.type === 'resolve' && !actionNotes.trim())
                        }
                    >
                        {actionDialog.type === 'approve' && 'Approve'}
                        {actionDialog.type === 'reject' && 'Reject'}
                        {actionDialog.type === 'resolve' && 'Resolve'}
                        {actionDialog.type === 'status' && 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DepartmentDashboard;
