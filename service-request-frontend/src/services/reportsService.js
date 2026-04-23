import api from '../api/axios';

/**
 * Reports Service
 * Handles API calls for reports and analytics
 */
const reportsService = {
    /**
     * Get overall statistics
     */
    getStatistics: async (startDate = null, endDate = null) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await api.get('/admin/reports/statistics', { params });
        return response.data;
    },

    /**
     * Get requests by status
     */
    getRequestsByStatus: async (startDate = null, endDate = null) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await api.get('/admin/reports/requests-by-status', { params });
        return response.data;
    },

    /**
     * Get requests by category
     */
    getRequestsByCategory: async (startDate = null, endDate = null) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await api.get('/admin/reports/requests-by-category', { params });
        return response.data;
    },

    /**
     * Get requests by priority
     */
    getRequestsByPriority: async (startDate = null, endDate = null) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await api.get('/admin/reports/requests-by-priority', { params });
        return response.data;
    },

    /**
     * Get requests over time
     */
    getRequestsOverTime: async (startDate = null, endDate = null, groupBy = 'day') => {
        const params = { groupBy };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await api.get('/admin/reports/requests-over-time', { params });
        return response.data;
    },

    /**
     * Get department performance
     */
    getDepartmentPerformance: async (startDate = null, endDate = null) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await api.get('/admin/reports/department-performance', { params });
        return response.data;
    },

    /**
     * Get agent performance
     */
    getAgentPerformance: async (startDate = null, endDate = null) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await api.get('/admin/reports/agent-performance', { params });
        return response.data;
    }
};

export default reportsService;
