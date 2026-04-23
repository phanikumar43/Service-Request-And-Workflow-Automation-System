import api from '../api/axios';

/**
 * Approval Service
 * Handles approval API calls
 */
const approvalService = {
    /**
     * Get pending approvals
     */
    getPendingApprovals: async () => {
        const response = await api.get('/approvals/pending');
        return response.data;
    },

    /**
     * Get approval by ID
     */
    getApprovalById: async (id) => {
        const response = await api.get(`/approvals/${id}`);
        return response.data;
    },

    /**
     * Approve request
     */
    approveRequest: async (id, comments) => {
        const response = await api.post(`/approvals/${id}/approve`, null, {
            params: { comments }
        });
        return response.data;
    },

    /**
     * Reject request
     */
    rejectRequest: async (id, comments) => {
        const response = await api.post(`/approvals/${id}/reject`, null, {
            params: { comments }
        });
        return response.data;
    },

    /**
     * Get approval history
     */
    getApprovalHistory: async (id) => {
        const response = await api.get(`/approvals/${id}/history`);
        return response.data;
    }
};

export default approvalService;
