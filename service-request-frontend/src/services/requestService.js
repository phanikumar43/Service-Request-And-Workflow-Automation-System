import api from '../api/axios';

/**
 * Service Request Service
 * Handles service request API calls
 */
const requestService = {
    /**
     * Create new service request
     */
    createRequest: async (requestData) => {
        const response = await api.post('/requests', requestData);
        return response.data;
    },

    /**
     * Get all requests with pagination
     */
    getAllRequests: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
        const response = await api.get('/requests', {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    /**
     * Get my requests
     */
    getMyRequests: async (page = 0, size = 10) => {
        const response = await api.get('/requests/my-requests', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get dashboard counts for current user
     */
    getDashboardCounts: async () => {
        const response = await api.get('/requests/dashboard/counts');
        return response.data;
    },

    /**
     * Get request by ID
     */
    getRequestById: async (id) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },

    /**
     * Get request by ticket ID
     */
    getRequestByTicketId: async (ticketId) => {
        const response = await api.get(`/requests/ticket/${ticketId}`);
        return response.data;
    },

    /**
     * Get requests by status
     */
    getRequestsByStatus: async (status, page = 0, size = 10) => {
        const response = await api.get(`/requests/status/${status}`, {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Update request status
     */
    updateStatus: async (id, status) => {
        const response = await api.patch(`/requests/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    /**
     * Assign request to agent
     */
    assignRequest: async (id, agentId) => {
        const response = await api.post(`/requests/${id}/assign`, null, {
            params: { agentId }
        });
        return response.data;
    },

    /**
     * Cancel request
     */
    cancelRequest: async (id) => {
        const response = await api.delete(`/requests/${id}`);
        return response.data;
    },

    /**
     * Add resolution notes
     */
    resolveRequest: async (id, notes) => {
        const response = await api.post(`/requests/${id}/resolve`, notes);
        return response.data;
    },

    /**
     * Close a resolved request
     */
    closeRequest: async (id) => {
        const response = await api.put(`/requests/${id}/close`);
        return response.data;
    }
};

export default requestService;
