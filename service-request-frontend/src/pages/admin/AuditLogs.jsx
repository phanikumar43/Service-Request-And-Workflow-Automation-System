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
    Chip,
    CircularProgress,
    TextField,
    InputAdornment
} from '@mui/material';
import { History, Search } from '@mui/icons-material';
import adminRequestService from '../../services/adminRequestService';
import { format } from 'date-fns';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = logs.filter(log =>
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs);
        }
    }, [searchTerm, logs]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            // Get all requests and extract activity logs
            const response = await adminRequestService.getAllRequests(null, null, null, null, 0, 100);
            const allLogs = [];

            // Extract activity logs from requests (simplified version)
            // In production, you'd have a dedicated endpoint
            if (response.requests) {
                response.requests.forEach(request => {
                    allLogs.push({
                        id: `${request.id}-created`,
                        action: 'REQUEST_CREATED',
                        details: `Request ${request.ticketId} created`,
                        performedBy: request.requesterName || 'System',
                        timestamp: request.createdAt,
                        ticketId: request.ticketId
                    });
                });
            }

            setLogs(allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            setFilteredLogs(allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        const colors = {
            REQUEST_CREATED: 'primary',
            STATUS_CHANGED: 'info',
            ASSIGNED: 'success',
            ESCALATED: 'warning',
            DELETED: 'error',
            UPDATED: 'default'
        };
        return colors[action] || 'default';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <History sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h4">Audit Logs</Typography>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Performed By</TableCell>
                                <TableCell>Ticket ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No audit logs found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            {log.timestamp ? format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm') : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.action}
                                                color={getActionColor(log.action)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{log.details}</TableCell>
                                        <TableCell>{log.performedBy}</TableCell>
                                        <TableCell>{log.ticketId || '-'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredLogs.length} of {logs.length} logs
                </Typography>
            </Box>
        </Box>
    );
};

export default AuditLogs;
