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
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Snackbar,
    Alert,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Business,
    ToggleOn,
    ToggleOff
} from '@mui/icons-material';
import departmentService from '../../services/departmentService';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        headName: '',
        email: '',
        phone: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const data = await departmentService.getAllDepartments();
            setDepartments(data);
        } catch (error) {
            showSnackbar('Failed to load departments', 'error');
            console.error('Error loading departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (department = null) => {
        if (department) {
            setSelectedDepartment(department);
            setFormData({
                name: department.name || '',
                description: department.description || '',
                headName: department.headName || '',
                email: department.email || '',
                phone: department.phone || ''
            });
        } else {
            setSelectedDepartment(null);
            setFormData({
                name: '',
                description: '',
                headName: '',
                email: '',
                phone: ''
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedDepartment(null);
        setFormData({
            name: '',
            description: '',
            headName: '',
            email: '',
            phone: ''
        });
    };

    const handleSave = async () => {
        try {
            if (selectedDepartment) {
                await departmentService.updateDepartment(selectedDepartment.id, formData);
                showSnackbar('Department updated successfully');
            } else {
                await departmentService.createDepartment(formData);
                showSnackbar('Department created successfully');
            }
            handleCloseDialog();
            loadDepartments();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to save department', 'error');
        }
    };

    const handleDelete = (department) => {
        setSelectedDepartment(department);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await departmentService.deleteDepartment(selectedDepartment.id);
            showSnackbar('Department deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedDepartment(null);
            loadDepartments();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to delete department', 'error');
        }
    };

    const handleToggleStatus = async (department) => {
        try {
            await departmentService.toggleDepartmentStatus(department.id);
            showSnackbar(`Department ${department.isActive ? 'deactivated' : 'activated'} successfully`);
            loadDepartments();
        } catch (error) {
            showSnackbar('Failed to toggle department status', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Department Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Department
                </Button>
            </Box>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Head</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No departments found. Create your first department!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                departments.map((dept) => (
                                    <TableRow key={dept.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Business sx={{ mr: 1, color: 'primary.main' }} />
                                                {dept.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{dept.description || '-'}</TableCell>
                                        <TableCell>{dept.headName || '-'}</TableCell>
                                        <TableCell>
                                            {dept.email && <div>{dept.email}</div>}
                                            {dept.phone && <div>{dept.phone}</div>}
                                            {!dept.email && !dept.phone && '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={dept.isActive ? 'Active' : 'Inactive'}
                                                color={dept.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleOpenDialog(dept)}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={dept.isActive ? 'Deactivate' : 'Activate'}>
                                                <IconButton
                                                    size="small"
                                                    color={dept.isActive ? 'warning' : 'success'}
                                                    onClick={() => handleToggleStatus(dept)}
                                                >
                                                    {dept.isActive ? <ToggleOff fontSize="small" /> : <ToggleOn fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(dept)}
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
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedDepartment ? 'Edit Department' : 'Add Department'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Department Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            label="Department Head"
                            value={formData.headName}
                            onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={!formData.name}>
                        {selectedDepartment ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Department?</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete <strong>{selectedDepartment?.name}</strong>?
                    This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
        </Box>
    );
};

export default DepartmentManagement;
