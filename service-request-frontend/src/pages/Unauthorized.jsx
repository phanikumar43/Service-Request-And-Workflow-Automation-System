import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button
} from '@mui/material';
import {
    Block,
    Home
} from '@mui/icons-material';
import authService from '../services/authService';

/**
 * Unauthorized Page
 * Shown when user tries to access a resource they don't have permission for
 */
const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        const dashboardRoute = authService.getDashboardRoute();
        navigate(dashboardRoute);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center', width: '100%' }}>
                    <Block sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

                    <Typography variant="h3" gutterBottom color="error">
                        Access Denied
                    </Typography>

                    <Typography variant="h6" color="text.secondary" paragraph>
                        You don't have permission to access this page
                    </Typography>

                    <Typography variant="body1" color="text.secondary" paragraph>
                        This page is restricted to users with specific roles.
                        If you believe you should have access, please contact your administrator.
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<Home />}
                            onClick={handleGoToDashboard}
                        >
                            Go to Dashboard
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Unauthorized;
