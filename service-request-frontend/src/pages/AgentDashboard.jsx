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
    IconButton,
    MenuItem
} from '@mui/material';
import { PlayArrow, CheckCircle, Visibility } from '@mui/icons-material';
import taskService from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const AgentDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getPendingTasks();
            setTasks(data);
        } catch (err) {
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (task, type) => {
        setSelectedTask(task);
        setActionType(type);
        setDialogOpen(true);
    };

    const handleSubmitAction = async () => {
        try {
            if (actionType === 'complete') {
                await taskService.completeTask(selectedTask.id, resolutionNotes);
            } else if (actionType === 'status') {
                await taskService.updateTaskStatus(selectedTask.id, newStatus);
            }
            setDialogOpen(false);
            setResolutionNotes('');
            setNewStatus('');
            loadTasks();
        } catch (err) {
            console.error('Error processing task:', err);
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

    const statusColors = {
        PENDING: 'warning',
        IN_PROGRESS: 'info',
        COMPLETED: 'success',
        CANCELLED: 'error'
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4">
                            Agent Dashboard
                        </Typography>
                        <Button variant="outlined" color="error" onClick={logout}>
                            Logout
                        </Button>
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        My Tasks ({tasks.length})
                    </Typography>

                    <TableContainer sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ticket ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Due Date</TableCell>
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
                                ) : tasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No pending tasks
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tasks.map((task) => (
                                        <TableRow key={task.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {task.request?.ticketId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{task.title}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={task.priority}
                                                    color={task.priority === 'CRITICAL' ? 'error' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={task.status}
                                                    color={statusColors[task.status]}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(task.dueDate)}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => navigate(`/request/${task.request?.id}`)}
                                                    title="View Details"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                                {task.status === 'PENDING' && (
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() => {
                                                            setSelectedTask(task);
                                                            setActionType('status');
                                                            setNewStatus('IN_PROGRESS');
                                                            setDialogOpen(true);
                                                        }}
                                                        title="Start Task"
                                                    >
                                                        <PlayArrow />
                                                    </IconButton>
                                                )}
                                                {task.status === 'IN_PROGRESS' && (
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleAction(task, 'complete')}
                                                        title="Complete Task"
                                                    >
                                                        <CheckCircle />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Task Action Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {actionType === 'complete' ? 'Complete Task' : 'Update Task Status'}
                </DialogTitle>
                <DialogContent>
                    {actionType === 'complete' ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Resolution Notes"
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Describe how the issue was resolved..."
                            required
                            sx={{ mt: 2 }}
                        />
                    ) : (
                        <TextField
                            select
                            fullWidth
                            label="New Status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            sx={{ mt: 2 }}
                        >
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="PENDING">Pending</MenuItem>
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitAction}
                        disabled={actionType === 'complete' && !resolutionNotes}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AgentDashboard;
