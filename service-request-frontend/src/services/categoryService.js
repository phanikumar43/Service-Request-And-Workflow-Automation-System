import api from '../api/axios';

/**
 * Category Service
 * Handles API calls for service categories and request types
 * Used by Create Request flow
 */
const categoryService = {
    /**
     * Get all active service categories
     * GET /api/user/service-catalog/categories
     */
    getCategories: async () => {
        console.log('📡 API Call: GET /api/user/service-catalog/categories');
        try {
            const response = await api.get('/user/service-catalog/categories');
            console.log('✅ Categories loaded:', response.data.length, 'categories');
            return response.data;
        } catch (error) {
            console.error('❌ Error loading categories:', error);
            throw error;
        }
    },

    /**
     * Get category by ID
     * GET /api/user/service-catalog/categories/{id}
     */
    getCategoryById: async (categoryId) => {
        console.log(`📡 API Call: GET /api/user/service-catalog/categories/${categoryId}`);
        try {
            const response = await api.get(`/user/service-catalog/categories/${categoryId}`);
            console.log('✅ Category loaded:', response.data);
            return response.data;
        } catch (error) {
            console.error(`❌ Error loading category ${categoryId}:`, error);
            throw error;
        }
    },

    /**
     * Get request types for a category (Mapping to Services now)
     * GET /api/user/service-catalog/categories/{categoryId}/services
     */
    getCategoryTypes: async (categoryId) => {
        console.log(`📡 API Call: GET /api/user/service-catalog/categories/${categoryId}/services`);
        try {
            const response = await api.get(`/user/service-catalog/categories/${categoryId}/services`);
            console.log('✅ Services loaded:', response.data.length, 'services');
            return response.data;
        } catch (error) {
            console.error(`❌ Error loading services for category ${categoryId}:`, error);
            throw error;
        }
    },

    /**
     * Get all active request types
     * GET /api/user/service-catalog/services
     */
    getAllTypes: async () => {
        console.log('📡 API Call: GET /api/user/service-catalog/services');
        try {
            const response = await api.get('/user/service-catalog/services');
            console.log('✅ All services loaded:', response.data.length, 'services');
            return response.data;
        } catch (error) {
            console.error('❌ Error loading all services:', error);
            throw error;
        }
    }
};

export default categoryService;

