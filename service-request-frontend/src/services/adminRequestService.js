import api from '../api/axios';

/**
 * Admin Request Service
 * Handles API calls for admin request management
 */
const adminRequestService = {
    /**
     * Get all requests with filtering and pagination
     */
    getAllRequests: async (filters = {}, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
        const params = {
            ...filters,
            page,
            size,
            sortBy,
            sortDir
        };
        const response = await api.get('/admin/requests', { params });
        return response.data;
    },

    /**
     * Assign department to request
     */
    assignDepartment: async (requestId, departmentId, notes = '') => {
        const response = await api.post(`/admin/requests/${requestId}/assign-department`, {
            departmentId,
            notes
        });
        return response.data;
    },

    /**
     * Assign agent to request
     */
    assignAgent: async (requestId, agentId, notes = '') => {
        const response = await api.post(`/admin/requests/${requestId}/assign-agent`, {
            agentId,
            notes
        });
        return response.data;
    },

    /**
     * Update request status
     */
    updateStatus: async (requestId, status, notes = '') => {
        const response = await api.put(`/admin/requests/${requestId}/status`, {
            status,
            notes
        });
        return response.data;
    },

    /**
     * Get request timeline
     */
    getTimeline: async (requestId) => {
        const response = await api.get(`/admin/requests/${requestId}/timeline`);
        return response.data;
    },

    // New methods for enhanced admin functionality

    /**
     * Update request priority
     */
    updatePriority: async (requestId, priority, notes = '') => {
        const response = await api.patch(`/admin/requests/${requestId}/priority`, {
            priority,
            notes
        });
        return response.data;
    },

    /**
     * Escalate request
     */
    escalateRequest: async (requestId, escalationData) => {
        const response = await api.post(`/admin/requests/${requestId}/escalate`, escalationData);
        return response.data;
    },

    /**
     * Get comprehensive request details
     */
    getRequestDetails: async (requestId) => {
        const response = await api.get(`/admin/requests/${requestId}/details`);
        return response.data;
    },

    /**
     * Delete request (Admin only)
     */
    deleteRequest: async (requestId) => {
        const response = await api.delete(`/admin/requests/${requestId}`);
        return response.data;
    },

    /**
     * Get agents by department
     */
    getAgentsByDepartment: async (departmentId) => {
        const response = await api.get('/admin/requests/agents', {
            params: { departmentId }
        });
        return response.data;
    }
};

export default adminRequestService;
