import api from '../api/axios';

/**
 * Service Catalog Service
 * Handles service catalog API calls
 */
const catalogService = {
    /**
     * Get all categories
     */
    getCategories: async () => {
        const response = await api.get('/services/categories');
        return response.data;
    },

    /**
     * Get all services
     */
    getServices: async () => {
        const response = await api.get('/services');
        return response.data;
    },

    /**
     * Get services by category
     */
    getServicesByCategory: async (categoryId) => {
        const response = await api.get(`/services/category/${categoryId}`);
        return response.data;
    },

    /**
     * Get service by ID
     */
    getServiceById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    }
};

export default catalogService;
