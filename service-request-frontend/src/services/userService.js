import api from '../api/axios';

/**
 * User Service
 * API calls for user operations
 */
const userService = {
    /**
     * Get current user profile
     */
    getUserProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    /**
     * Update user profile
     */
    updateUserProfile: async (profileData) => {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    },

    /**
     * Get user dashboard statistics
     */
    getUserStats: async () => {
        const response = await api.get('/user/dashboard/stats');
        return response.data;
    },

    /**
     * Change password
     */
    changePassword: async (oldPassword, newPassword) => {
        const response = await api.post('/user/change-password', {
            oldPassword,
            newPassword
        });
        return response.data;
    }
};

export default userService;
