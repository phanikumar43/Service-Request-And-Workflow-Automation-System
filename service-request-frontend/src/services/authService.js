import api from '../api/axios';

// Role constants
export const ROLES = {
    ADMIN: 'ROLE_ADMIN',
    USER: 'ROLE_USER',
    END_USER: 'ROLE_END_USER',
    APPROVER: 'ROLE_APPROVER',
    AGENT: 'ROLE_AGENT',
    DEPARTMENT: 'ROLE_DEPARTMENT'
};

/**
 * Authentication Service
 * Handles login, register, and user authentication
 */
const authService = {
    /**
     * Login user
     */
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    /**
     * Register new user
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get user roles
     */
    getUserRoles: () => {
        const user = authService.getCurrentUser();
        return user?.roles || [];
    },

    /**
     * Check if user has specific role
     */
    hasRole: (role) => {
        const roles = authService.getUserRoles();
        return roles.includes(role);
    },

    /**
     * Get primary role (priority: ADMIN > APPROVER > AGENT > USER/END_USER)
     */
    getPrimaryRole: () => {
        const roles = authService.getUserRoles();

        if (roles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
        if (roles.includes(ROLES.DEPARTMENT)) return ROLES.DEPARTMENT;
        if (roles.includes(ROLES.APPROVER)) return ROLES.APPROVER;
        if (roles.includes(ROLES.AGENT)) return ROLES.AGENT;
        if (roles.includes(ROLES.USER)) return ROLES.USER;
        if (roles.includes(ROLES.END_USER)) return ROLES.END_USER;

        return null;
    },

    /**
     * Check if user is admin
     */
    isAdmin: () => {
        return authService.hasRole(ROLES.ADMIN);
    },

    /**
     * Check if user is regular user
     */
    isUser: () => {
        return authService.hasRole(ROLES.USER) || authService.hasRole(ROLES.END_USER);
    },

    /**
     * Get dashboard route based on role
     */
    getDashboardRoute: () => {
        const primaryRole = authService.getPrimaryRole();

        switch (primaryRole) {
            case ROLES.ADMIN:
                return '/admin/dashboard';
            case ROLES.DEPARTMENT:
                return '/department/dashboard';
            case ROLES.APPROVER:
                return '/approvals';
            case ROLES.AGENT:
                return '/tasks';
            case ROLES.USER:
            case ROLES.END_USER:
                return '/user/dashboard';
            default:
                return '/dashboard';
        }
    }
};

export default authService;
