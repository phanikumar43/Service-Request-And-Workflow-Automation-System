import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Tabs,
    Tab,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    AdminPanelSettings,
    Person,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState(0); // 0 = User, 1 = Admin
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
        setFormData({ username: '', password: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login(formData.username, formData.password);

            // Check if user has the expected role
            const isAdmin = userData.roles?.includes('ROLE_ADMIN');
            const isUser = userData.roles?.includes('ROLE_USER') || userData.roles?.includes('ROLE_END_USER');

            if (activeTab === 1 && !isAdmin) {
                setError('Access denied. This account does not have admin privileges.');
                setLoading(false);
                return;
            }

            if (activeTab === 0 && !isUser && !isAdmin) {
                setError('Access denied. This account does not have user privileges.');
                setLoading(false);
                return;
            }

            // Redirect based on role
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else if (isUser) {
                navigate('/user/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}>
                <Paper elevation={6} sx={{ p: 4, width: '100%' }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" gutterBottom fontWeight="bold">
                            Service Request System
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to continue
                        </Typography>
                    </Box>

                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab
                            icon={<Person />}
                            label="User Login"
                            iconPosition="start"
                            sx={{ fontWeight: activeTab === 0 ? 'bold' : 'normal' }}
                        />
                        <Tab
                            icon={<AdminPanelSettings />}
                            label="Admin Login"
                            iconPosition="start"
                            sx={{ fontWeight: activeTab === 1 ? 'bold' : 'normal' }}
                        />
                    </Tabs>

                    {/* User Login Tab */}
                    {activeTab === 0 && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                            <Typography variant="body2" color="primary">
                                <strong>User Access:</strong> Create and track your service requests
                            </Typography>
                        </Box>
                    )}

                    {/* Admin Login Tab */}
                    {activeTab === 1 && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            <Typography variant="body2" color="warning.dark">
                                <strong>Admin Access:</strong> Manage users, requests, and system settings
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoFocus
                            placeholder={activeTab === 1 ? "Enter admin username" : "Enter your username"}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            placeholder={activeTab === 1 ? "Enter admin password" : "Enter your password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            color={activeTab === 1 ? 'warning' : 'primary'}
                        >
                            {loading ? 'Signing in...' : `Sign in as ${activeTab === 1 ? 'Admin' : 'User'}`}
                        </Button>

                        {activeTab === 0 && (
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2">
                                    Don't have an account?{' '}
                                    <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                                        Register here
                                    </Link>
                                </Typography>
                            </Box>
                        )}

                        {activeTab === 1 && (
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Admin accounts are created by system administrators
                                </Typography>
                            </Box>
                        )}
                    </form>

                    {/* Quick Test Credentials (Remove in production) */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            <strong>Test Credentials:</strong>
                        </Typography>
                        {activeTab === 1 ? (
                            <Typography variant="caption" color="text.secondary">
                                Admin: username: <code>admin</code> | password: <code>Admin@123</code>
                            </Typography>
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                User: Register a new account or use existing credentials
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
