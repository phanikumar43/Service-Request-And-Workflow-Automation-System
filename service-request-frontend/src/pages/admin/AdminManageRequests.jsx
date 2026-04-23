import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import {
    Visibility,
    Business,
    Person,
    Edit,
    PriorityHigh,
    TrendingUp,
    Delete
} from '@mui/icons-material';
import adminRequestService from '../../services/adminRequestService';
import ChangePriorityModal from '../../components/admin/ChangePriorityModal';
import ChangeStatusModal from '../../components/admin/ChangeStatusModal';
import EscalateRequestModal from '../../components/admin/EscalateRequestModal';
import ViewDetailsModal from '../../components/admin/ViewDetailsModal';
import AssignDepartmentModal from '../../components/admin/AssignDepartmentModal';
import AssignAgentModal from '../../components/admin/AssignAgentModal';

const AdminManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Modal states
    const [priorityModalOpen, setPriorityModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [escalateModalOpen, setEscalateModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignDeptModalOpen, setAssignDeptModalOpen] = useState(false);
    const [assignAgentModalOpen, setAssignAgentModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requestDetails, setRequestDetails] = useState(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadRequests();
    }, [page, rowsPerPage]);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await adminRequestService.getAllRequests({}, page, rowsPerPage);
            setRequests(data.requests || []);
            setTotalItems(data.totalItems || 0);
        } catch (error) {
            showSnackbar('Failed to load requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Action handlers
    const handleViewDetails = async (request) => {
        try {
            const details = await adminRequestService.getRequestDetails(request.id);
            setRequestDetails(details);
            setDetailsModalOpen(true);
        } catch (error) {
            showSnackbar('Failed to load request details', 'error');
        }
    };

    const handleChangePriority = (request) => {
        setSelectedRequest(request);
        setPriorityModalOpen(true);
    };

    const handleChangeStatus = (request) => {
        setSelectedRequest(request);
        setStatusModalOpen(true);
    };

    const handleEscalate = (request) => {
        setSelectedRequest(request);
        setEscalateModalOpen(true);
    };

    const handleDelete = (request) => {
        setSelectedRequest(request);
        setDeleteDialogOpen(true);
    };

    // Submit handlers
    const handlePrioritySubmit = async (requestId, priority, notes) => {
        try {
            await adminRequestService.updatePriority(requestId, priority, notes);
            showSnackbar('Priority updated successfully');
            loadRequests();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to update priority', 'error');
        }
    };

    const handleStatusSubmit = async (requestId, status, notes) => {
        try {
            await adminRequestService.updateStatus(requestId, status, notes);
            showSnackbar('Status updated successfully');
            loadRequests();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to update status', 'error');
        }
    };

    const handleEscalateSubmit = async (requestId, escalationData) => {
        try {
            await adminRequestService.escalateRequest(requestId, escalationData);
            showSnackbar('Request escalated successfully', 'warning');
            loadRequests();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to escalate request', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await adminRequestService.deleteRequest(selectedRequest.id);
            showSnackbar('Request deleted successfully', 'success');
            setDeleteDialogOpen(false);
            setSelectedRequest(null);
            loadRequests();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to delete request', 'error');
        }
    };

    const handleAssignDepartment = (request) => {
        setSelectedRequest(request);
        setAssignDeptModalOpen(true);
    };

    const handleDepartmentAssignSubmit = async (requestId, departmentId, notes) => {
        try {
            await adminRequestService.assignDepartment(requestId, departmentId, notes);
            showSnackbar('Department assigned successfully');
            loadRequests();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to assign department', 'error');
        }
    };

    const handleAssignAgent = (request) => {
        setSelectedRequest(request);
        setAssignAgentModalOpen(true);
    };

    const handleAgentAssignSubmit = async (requestId, agentId, notes) => {
        try {
            await adminRequestService.assignAgent(requestId, agentId, notes);
            showSnackbar('Agent assigned successfully');
            loadRequests();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to assign agent', 'error');
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Service Requests
            </Typography>

            <Paper sx={{ mt: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ticket ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Requester</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Agent</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        No requests found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.ticketId}</TableCell>
                                        <TableCell>{request.title}</TableCell>
                                        <TableCell>{request.userName}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.priority}
                                                color={getPriorityColor(request.priority)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.status}
                                                color={getStatusColor(request.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{request.departmentName || 'Unassigned'}</TableCell>
                                        <TableCell>{request.assignedAgentName || 'Unassigned'}</TableCell>
                                        <TableCell>
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewDetails(request)}
                                                    color="primary"
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Change Status">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleChangeStatus(request)}
                                                    color="info"
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Change Priority">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleChangePriority(request)}
                                                    color="warning"
                                                >
                                                    <PriorityHigh fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Escalate">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEscalate(request)}
                                                    color="error"
                                                >
                                                    <TrendingUp fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Assign Department">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleAssignDepartment(request)}
                                                    color="success"
                                                >
                                                    <Business fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Assign Agent">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleAssignAgent(request)}
                                                    color="secondary"
                                                >
                                                    <Person fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(request)}
                                                    color="error"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={totalItems}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>

            {/* Modals */}
            <ChangePriorityModal
                open={priorityModalOpen}
                onClose={() => setPriorityModalOpen(false)}
                request={selectedRequest}
                onSubmit={handlePrioritySubmit}
            />

            <ChangeStatusModal
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                request={selectedRequest}
                onSubmit={handleStatusSubmit}
            />

            <EscalateRequestModal
                open={escalateModalOpen}
                onClose={() => setEscalateModalOpen(false)}
                request={selectedRequest}
                onSubmit={handleEscalateSubmit}
            />

            <ViewDetailsModal
                open={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                requestDetails={requestDetails}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Request?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete request <strong>{selectedRequest?.ticketId}</strong>?
                        <br />
                        <br />
                        This action cannot be undone. All related data including comments, attachments, and history will be permanently deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign Department Modal */}
            <AssignDepartmentModal
                open={assignDeptModalOpen}
                onClose={() => setAssignDeptModalOpen(false)}
                request={selectedRequest}
                onAssign={handleDepartmentAssignSubmit}
            />

            {/* Assign Agent Modal */}
            <AssignAgentModal
                open={assignAgentModalOpen}
                onClose={() => setAssignAgentModalOpen(false)}
                request={selectedRequest}
                onAssign={handleAgentAssignSubmit}
            />
        </Box>
    );
};

export default AdminManageRequests;
