import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Alert,
    Stack,
    Divider
} from '@mui/material';
import {
    AdminPanelSettings,
    Person,
    Group,
    Security,
    Business
} from '@mui/icons-material';
import adminService from '../../services/adminService';

/**
 * AssignRoleModal Component
 * Modal for managing user roles - add or remove multiple roles
 */
const AssignRoleModal = ({ open, onClose, user, onSuccess }) => {
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const availableRoles = [
        { value: 'ROLE_ADMIN', label: 'Admin', icon: <AdminPanelSettings />, color: 'error' },
        { value: 'ROLE_DEPARTMENT', label: 'Department', icon: <Business />, color: 'secondary' },
        { value: 'ROLE_APPROVER', label: 'Approver', icon: <Security />, color: 'warning' },
        { value: 'ROLE_AGENT', label: 'Agent', icon: <Group />, color: 'info' },
        { value: 'ROLE_USER', label: 'User', icon: <Person />, color: 'default' }
    ];

    // Helper function to normalize roles (handle both strings and objects)
    const getNormalizedRoles = () => {
        if (!user.roles) return [];
        return user.roles.map(role => {
            // If role is an object, extract the name property
            if (typeof role === 'object' && role.name) {
                return role.name;
            }
            // If role is already a string, return as is
            return role;
        });
    };

    const handleAddRole = async () => {
        if (!selectedRole) {
            setError('Please select a role to add');
            return;
        }

        const normalizedRoles = getNormalizedRoles();
        if (normalizedRoles.includes(selectedRole)) {
            setError('User already has this role');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await adminService.assignRole(user.id, selectedRole);
            setSuccess(`Successfully assigned ${getRoleLabel(selectedRole)} role`);
            setSelectedRole('');

            // Notify parent component
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }
        } catch (err) {
            setError('Failed to assign role: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRole = async (roleName) => {
        const normalizedRoles = getNormalizedRoles();
        if (normalizedRoles.length === 1) {
            setError('Cannot remove the last role. User must have at least one role.');
            return;
        }

        if (window.confirm(`Are you sure you want to remove ${getRoleLabel(roleName)} role from ${user.username}?`)) {
            try {
                setLoading(true);
                setError('');
                await adminService.removeRole(user.id, roleName);
                setSuccess(`Successfully removed ${getRoleLabel(roleName)} role`);

                // Notify parent component
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 1000);
                }
            } catch (err) {
                setError('Failed to remove role: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        }
    };

    const getRoleLabel = (roleName) => {
        const role = availableRoles.find(r => r.value === roleName);
        return role ? role.label : roleName;
    };

    const getRoleColor = (roleName) => {
        const role = availableRoles.find(r => r.value === roleName);
        return role ? role.color : 'default';
    };

    const getRoleIcon = (roleName) => {
        const role = availableRoles.find(r => r.value === roleName);
        return role ? role.icon : <Person />;
    };

    const getAvailableRolesToAdd = () => {
        const normalizedRoles = getNormalizedRoles();
        return availableRoles.filter(role => !normalizedRoles.includes(role.value));
    };

    if (!user) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Manage Roles for {user.username}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
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

                    {/* Current Roles */}
                    <Typography variant="subtitle2" gutterBottom>
                        Current Roles
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                        {user.roles && user.roles.length > 0 ? (
                            getNormalizedRoles().map((roleName) => (
                                <Chip
                                    key={roleName}
                                    label={getRoleLabel(roleName)}
                                    color={getRoleColor(roleName)}
                                    icon={getRoleIcon(roleName)}
                                    onDelete={() => handleRemoveRole(roleName)}
                                    sx={{ mb: 1 }}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No roles assigned
                            </Typography>
                        )}
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Add New Role */}
                    <Typography variant="subtitle2" gutterBottom>
                        Add New Role
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <FormControl fullWidth>
                            <InputLabel>Select Role</InputLabel>
                            <Select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                label="Select Role"
                                disabled={loading || getAvailableRolesToAdd().length === 0}
                            >
                                {getAvailableRolesToAdd().map((role) => (
                                    <MenuItem key={role.value} value={role.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {role.icon}
                                            {role.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={handleAddRole}
                            disabled={loading || !selectedRole}
                            sx={{ minWidth: '100px', height: '56px' }}
                        >
                            Add
                        </Button>
                    </Box>

                    {getAvailableRolesToAdd().length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            User has all available roles
                        </Typography>
                    )}

                    {/* User Info */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            User Information
                        </Typography>
                        <Typography variant="body2">
                            <strong>Name:</strong> {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Email:</strong> {user.email}
                        </Typography>
                        {user.department && (
                            <Typography variant="body2">
                                <strong>Department:</strong> {user.department}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignRoleModal;
