import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import {
    Container,
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress
} from '@mui/material';
import {
    People,
    Assignment,
    Settings,
    BarChart,
    Category,
    AdminPanelSettings
} from '@mui/icons-material';

/**
 * Admin Dashboard
 * Dashboard for administrators with system management features
 */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [requestStats, setRequestStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [adminData, reportsData] = await Promise.all([
                adminService.getAdminStats(),
                // Import reportsService at the top
                fetch('/api/admin/reports/statistics', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => res.json())
            ]);
            setStats(adminData);
            setRequestStats(reportsData);
        } catch (error) {
            console.error('Failed to load admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: <People />,
            color: '#1976d2'
        },
        {
            title: 'Active Users',
            value: stats?.activeUsers || 0,
            icon: <AdminPanelSettings />,
            color: '#4caf50'
        },
        {
            title: 'Inactive Users',
            value: stats?.inactiveUsers || 0,
            icon: <People />,
            color: '#ff9800'
        },
        {
            title: 'Total Requests',
            value: requestStats?.totalRequests || 0,
            icon: <Assignment />,
            color: '#9c27b0'
        },
    ];

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'Add, edit, or remove users and assign roles',
            icon: <People />,
            color: 'primary',
            action: () => navigate('/admin/users')
        },
        {
            title: 'Service Catalog',
            description: 'Configure available services and categories',
            icon: <Category />,
            color: 'secondary',
            action: () => navigate('/admin/service-catalog')
        },
        {
            title: 'View All Requests',
            description: 'Monitor and manage all service requests',
            icon: <Assignment />,
            color: 'info',
            action: () => navigate('/admin/requests')
        },
        {
            title: 'Reports & Analytics',
            description: 'View system reports and analytics',
            icon: <BarChart />,
            color: 'success',
            action: () => navigate('/admin/reports')
        },
        {
            title: 'System Settings',
            description: 'Configure system-wide settings',
            icon: <Settings />,
            color: 'warning',
            action: () => navigate('/admin/settings')
        }
    ];

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
                <Typography variant="h4" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Welcome back, {user?.username}! Manage your system from here.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {statCards.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{ color: stat.color, mr: 2 }}>
                                            {stat.icon}
                                        </Box>
                                        <Typography variant="h6" component="div">
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" component="div" sx={{ color: stat.color }}>
                                        {stat.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Additional Request Statistics */}
                {requestStats && (
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Pending
                                    </Typography>
                                    <Typography variant="h3" color="warning.main">
                                        {requestStats.pendingRequests || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        In Progress
                                    </Typography>
                                    <Typography variant="h3" color="info.main">
                                        {requestStats.inProgressRequests || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Resolved
                                    </Typography>
                                    <Typography variant="h3" color="success.main">
                                        {requestStats.resolvedRequests || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Cancelled
                                    </Typography>
                                    <Typography variant="h3" color="error.main">
                                        {requestStats.cancelledRequests || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={3}>
                    {quickActions.map((action, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Box sx={{ mr: 2 }}>
                                            {action.icon}
                                        </Box>
                                        <Typography variant="h6">
                                            {action.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {action.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color={action.color}
                                        onClick={action.action}
                                    >
                                        Go
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {stats?.usersByRole && (
                    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Users by Role
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(stats.usersByRole).map(([role, count]) => (
                                <Grid item xs={12} sm={6} md={3} key={role}>
                                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {role}
                                        </Typography>
                                        <Typography variant="h4">
                                            {count}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default AdminDashboard;
