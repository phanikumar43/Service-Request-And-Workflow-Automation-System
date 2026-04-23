import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    CheckCircle,
    Cancel,
    PersonAdd,
    AdminPanelSettings,
    ManageAccounts
} from '@mui/icons-material';
import AssignRoleModal from '../../components/admin/AssignRoleModal';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openRoleModal, setOpenRoleModal] = useState(false);
    const [selectedUserForRole, setSelectedUserForRole] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        role: 'ROLE_USER'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
            setError('');
        } catch (err) {
            setError('Failed to load users: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setEditMode(true);
            setCurrentUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone || '',
                department: user.department || '',
                role: user.roles?.[0] || 'ROLE_USER'
            });
        } else {
            setEditMode(false);
            setCurrentUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phone: '',
                department: '',
                role: 'ROLE_USER'
            });
        }
        setOpenDialog(true);
        setError('');
        setSuccess('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentUser(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await adminService.updateUser(currentUser.id, formData);
                setSuccess('User updated successfully');
            } else {
                await adminService.createUser(formData);
                setSuccess('User created successfully');
            }
            handleCloseDialog();
            loadUsers();
        } catch (err) {
            setError('Failed to save user: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminService.deleteUser(userId);
                setSuccess('User deleted successfully');
                loadUsers();
            } catch (err) {
                setError('Failed to delete user: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleToggleActive = async (user) => {
        try {
            if (user.isActive) {
                await adminService.deactivateUser(user.id);
                setSuccess('User deactivated successfully');
            } else {
                await adminService.activateUser(user.id);
                setSuccess('User activated successfully');
            }
            loadUsers();
        } catch (err) {
            setError('Failed to update user status: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleOpenRoleModal = (user) => {
        setSelectedUserForRole(user);
        setOpenRoleModal(true);
    };

    const handleCloseRoleModal = () => {
        setOpenRoleModal(false);
        setSelectedUserForRole(null);
        loadUsers(); // Refresh user list after role changes
    };

    const getRoleColor = (roles) => {
        if (roles?.includes('ROLE_ADMIN')) return 'error';
        if (roles?.includes('ROLE_DEPARTMENT')) return 'secondary';
        if (roles?.includes('ROLE_APPROVER')) return 'warning';
        if (roles?.includes('ROLE_AGENT')) return 'info';
        return 'default';
    };

    const getRoleLabel = (roles) => {
        if (roles?.includes('ROLE_ADMIN')) return 'Admin';
        if (roles?.includes('ROLE_DEPARTMENT')) return 'Department';
        if (roles?.includes('ROLE_APPROVER')) return 'Approver';
        if (roles?.includes('ROLE_AGENT')) return 'Agent';
        if (roles?.includes('ROLE_USER')) return 'User';
        if (roles?.includes('ROLE_END_USER')) return 'End User';
        return 'Unknown';
    };

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        User Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAdd />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add New User
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Username</strong></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.department || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getRoleLabel(user.roles)}
                                            color={getRoleColor(user.roles)}
                                            size="small"
                                            icon={user.roles?.includes('ROLE_ADMIN') ? <AdminPanelSettings /> : undefined}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.isActive ? 'Active' : 'Inactive'}
                                            color={user.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit User">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => handleOpenDialog(user)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                                            <IconButton
                                                color={user.isActive ? 'warning' : 'success'}
                                                size="small"
                                                onClick={() => handleToggleActive(user)}
                                            >
                                                {user.isActive ? <Cancel /> : <CheckCircle />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Manage Roles">
                                            <IconButton
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleOpenRoleModal(user)}
                                            >
                                                <ManageAccounts />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete User">
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {users.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            No users found. Click "Add New User" to create one.
                        </Typography>
                    </Box>
                )}

                {/* Add/Edit User Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editMode ? 'Edit User' : 'Add New User'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                margin="normal"
                                required
                                disabled={editMode}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            {!editMode && (
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                            )}
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    label="Role"
                                >
                                    <MenuItem value="ROLE_USER">User</MenuItem>
                                    <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                                    <MenuItem value="ROLE_DEPARTMENT">Department</MenuItem>
                                    <MenuItem value="ROLE_APPROVER">Approver</MenuItem>
                                    <MenuItem value="ROLE_AGENT">Agent</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {editMode ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Assign Role Modal */}
                <AssignRoleModal
                    open={openRoleModal}
                    onClose={handleCloseRoleModal}
                    user={selectedUserForRole}
                    onSuccess={handleCloseRoleModal}
                />
            </Box>
        </Container>
    );
};

export default UserManagement;
