import api from '../api/axios';

const departmentRequestService = {
    /**
     * Get requests assigned to the logged-in user's department
     */
    getDepartmentRequests: async (filters = {}, page = 0, size = 10) => {
        const params = {
            ...filters,
            page,
            size
        };
        const response = await api.get('/department/dashboard/assigned-requests', { params });
        return response.data;
    },

    /**
     * Update request status (e.g., IN_PROGRESS, WAITING_FOR_USER)
     */
    updateStatus: async (requestId, status, notes) => {
        const response = await api.put(`/department/actions/requests/${requestId}/status`, {
            status,
            notes
        });
        return response.data;
    },

    /**
     * Resolve a request
     */
    resolveRequest: async (requestId, resolutionNotes) => {
        const response = await api.post(`/department/actions/requests/${requestId}/resolve`, {
            resolutionNotes
        });
        return response.data;
    },

    /**
     * Approve a request
     */
    approveRequest: async (requestId, notes) => {
        const response = await api.put(`/department/actions/requests/${requestId}/approve`, {
            notes
        });
        return response.data;
    },

    /**
     * Reject a request
     */
    rejectRequest: async (requestId, rejectionReason) => {
        const response = await api.put(`/department/actions/requests/${requestId}/reject`, {
            rejectionReason
        });
        return response.data;
    }
};

export default departmentRequestService;
