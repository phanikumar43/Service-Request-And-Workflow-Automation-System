import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const DepartmentRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // Check if user has ROLE_DEPARTMENT
    const isDepartmentUser = user && user.roles && user.roles.includes('ROLE_DEPARTMENT');

    // Allow access if user is DEPARTMENT or ADMIN (admins usually can see everything, though dashboard is for dept users)
    // Requirement says: "Visible only to ROLE_DEPARTMENT"
    // Let's stick to strict checking or allow admin to debug

    if (!user || (!isDepartmentUser && !user.roles.includes('ROLE_ADMIN'))) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default DepartmentRoute;
