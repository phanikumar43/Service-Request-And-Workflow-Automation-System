import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    Container,
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import {
    Edit,
    Save,
    Cancel,
    Visibility,
    VisibilityOff,
    Person
} from '@mui/icons-material';

/**
 * My Profile Page
 * Allows users to view and edit their profile information
 */
const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        department: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/profile');
            setProfile(response.data);
            setFormData({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                phone: response.data.phone || '',
                department: response.data.department || ''
            });
        } catch (err) {
            setError('Failed to load profile');
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
        setSuccess('');
        setError('');
    };

    const handleCancel = () => {
        setEditMode(false);
        setFormData({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            department: profile.department || ''
        });
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            setError('');
            const response = await api.put('/user/profile', formData);
            setProfile(response.data);
            setEditMode(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New password and confirm password do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        try {
            await api.put('/user/change-password', passwordData);
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setPasswordSuccess(''), 3000);
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        }
    };

    const getInitials = () => {
        if (!profile) return '?';
        const first = profile.firstName?.charAt(0) || '';
        const last = profile.lastName?.charAt(0) || '';
        return (first + last).toUpperCase() || profile.username?.charAt(0).toUpperCase() || '?';
    };

    const getAvatarColor = () => {
        if (!profile?.username) return '#1976d2';
        const colors = ['#1976d2', '#388e3c', '#d32f2f', '#f57c00', '#7b1fa2', '#0288d1'];
        const index = profile.username.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {/* Profile Information Card */}
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: getAvatarColor(),
                                fontSize: '2rem',
                                mr: 3
                            }}
                        >
                            {getInitials()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5">
                                {profile?.firstName} {profile?.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                @{profile?.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {profile?.roles?.join(', ')}
                            </Typography>
                        </Box>
                        {!editMode && (
                            <Button
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={handleEdit}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!editMode}
                                variant={editMode ? 'outlined' : 'filled'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!editMode}
                                variant={editMode ? 'outlined' : 'filled'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={profile?.email || ''}
                                disabled
                                variant="filled"
                                helperText="Email cannot be changed"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!editMode}
                                variant={editMode ? 'outlined' : 'filled'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                disabled={!editMode}
                                variant={editMode ? 'outlined' : 'filled'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Account Status"
                                value={profile?.isActive ? 'Active' : 'Inactive'}
                                disabled
                                variant="filled"
                            />
                        </Grid>
                    </Grid>

                    {editMode && (
                        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    )}
                </Paper>

                {/* Change Password Card */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Change Password
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {passwordSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setPasswordSuccess('')}>
                            {passwordSuccess}
                        </Alert>
                    )}

                    {passwordError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPasswordError('')}>
                            {passwordError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handlePasswordSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Current Password"
                                    name="currentPassword"
                                    type={showPassword.current ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword({
                                                        ...showPassword,
                                                        current: !showPassword.current
                                                    })}
                                                    edge="end"
                                                >
                                                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    name="newPassword"
                                    type={showPassword.new ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword({
                                                        ...showPassword,
                                                        new: !showPassword.new
                                                    })}
                                                    edge="end"
                                                >
                                                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type={showPassword.confirm ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword({
                                                        ...showPassword,
                                                        confirm: !showPassword.confirm
                                                    })}
                                                    edge="end"
                                                >
                                                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Change Password
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;
