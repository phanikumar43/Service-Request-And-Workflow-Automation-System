import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService, { ROLES } from '../services/authService';

/**
 * User Route Component
 * Protected route for user pages
 * Allows ROLE_USER, ROLE_END_USER, or ROLE_ADMIN
 */
const UserRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Allow users with USER, END_USER, or ADMIN roles
    const hasAccess = authService.hasRole(ROLES.USER) ||
        authService.hasRole(ROLES.END_USER) ||
        authService.hasRole(ROLES.ADMIN);

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default UserRoute;
