import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button
} from '@mui/material';
import {
    Assignment,
    CheckCircle,
    Pending,
    Cancel,
    Add
} from '@mui/icons-material';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const stats = [
        { title: 'Total Requests', value: '0', icon: <Assignment />, color: '#1976d2' },
        { title: 'Pending', value: '0', icon: <Pending />, color: '#ff9800' },
        { title: 'Completed', value: '0', icon: <CheckCircle />, color: '#4caf50' },
        { title: 'Cancelled', value: '0', icon: <Cancel />, color: '#f44336' },
    ];

    const quickActions = [
        {
            title: 'Create New Request',
            description: 'Submit a new service request',
            icon: <Add />,
            color: 'primary',
            action: () => navigate('/create-request')
        },
        {
            title: 'My Requests',
            description: 'View and track your requests',
            icon: <Assignment />,
            color: 'secondary',
            action: () => navigate('/my-requests')
        }
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {user?.username}!
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    {user?.email}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {stats.map((stat, index) => (
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

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={3}>
                    {quickActions.map((action, index) => (
                        <Grid item xs={12} sm={6} key={index}>
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

                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Getting Started
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Welcome to the Service Request System! Here's how to get started:
                    </Typography>
                    <Box component="ol" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Create a Request:</strong> Click "Create New Request" to submit a service request
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Track Progress:</strong> View "My Requests" to see the status of your submissions
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Get Notified:</strong> Receive updates when your request status changes
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;
