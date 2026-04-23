import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
import departmentService from '../../services/departmentService';

const AssignDepartmentModal = ({ open, onClose, request, onAssign }) => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingDepts, setLoadingDepts] = useState(true);

    useEffect(() => {
        if (open) {
            loadDepartments();
            setSelectedDepartment(request?.departmentId || '');
            setNotes('');
        }
    }, [open, request]);

    const loadDepartments = async () => {
        setLoadingDepts(true);
        try {
            const data = await departmentService.getAllDepartments();
            setDepartments(data.filter(dept => dept.isActive));
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setLoadingDepts(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedDepartment) {
            return;
        }

        setLoading(true);
        try {
            await onAssign(request.id, selectedDepartment, notes);
            onClose();
        } catch (error) {
            console.error('Failed to assign department:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Assign Department
            </DialogTitle>
            <DialogContent>
                {request && (
                    <Box sx={{ mb: 2, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Request: <strong>{request.ticketId}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Title: {request.title}
                        </Typography>
                        {request.departmentName && (
                            <Typography variant="body2" color="text.secondary">
                                Current Department: <strong>{request.departmentName}</strong>
                            </Typography>
                        )}
                    </Box>
                )}

                {loadingDepts ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Department</InputLabel>
                            <Select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                label="Select Department"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Notes (Optional)"
                            multiline
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about this assignment..."
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleAssign}
                    variant="contained"
                    disabled={!selectedDepartment || loading || loadingDepts}
                >
                    {loading ? <CircularProgress size={24} /> : 'Assign Department'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignDepartmentModal;
