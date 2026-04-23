import api from '../api/axios';

/**
 * Admin Service
 * API calls for admin operations
 */
const adminService = {
    /**
     * Get all users
     */
    getAllUsers: async () => {
        const response = await api.get('/api/admin/users');
        return response.data;
    },

    /**
     * Get user by ID
     */
    getUserById: async (id) => {
        const response = await api.get(`/api/admin/users/${id}`);
        return response.data;
    },

    /**
     * Create new user
     */
    createUser: async (userData) => {
        const response = await api.post('/api/admin/users', userData);
        return response.data;
    },

    /**
     * Update user
     */
    updateUser: async (id, userData) => {
        const response = await api.put(`/api/admin/users/${id}`, userData);
        return response.data;
    },

    /**
     * Delete user
     */
    deleteUser: async (id) => {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    },

    /**
     * Assign role to user
     */
    assignRole: async (userId, roleName) => {
        const response = await api.post(`/api/admin/users/${userId}/roles`, { roleName });
        return response.data;
    },

    /**
     * Remove role from user
     */
    removeRole: async (userId, roleName) => {
        const response = await api.delete(`/api/admin/users/${userId}/roles/${roleName}`);
        return response.data;
    },

    /**
     * Get admin dashboard statistics
     */
    getAdminStats: async () => {
        const response = await api.get('/api/admin/dashboard/stats');
        return response.data;
    },

    /**
     * Activate user
     */
    activateUser: async (id) => {
        const response = await api.put(`/api/admin/users/${id}/activate`);
        return response.data;
    },

    /**
     * Deactivate user
     */
    deactivateUser: async (id) => {
        const response = await api.put(`/api/admin/users/${id}/deactivate`);
        return response.data;
    }
};

export default adminService;
