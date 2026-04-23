import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService, { ROLES } from '../services/authService';

/**
 * Admin Route Component
 * Protected route for admin-only pages
 * Redirects to unauthorized if user doesn't have ROLE_ADMIN
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!authService.hasRole(ROLES.ADMIN)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default AdminRoute;
