import api from '../api/axios';

/**
 * Department Service
 * Handles API calls for department and agent management
 */
const departmentService = {
    /**
     * Get all active departments
     */
    getAllDepartments: async () => {
        const response = await api.get('/admin/departments');
        return response.data;
    },

    /**
     * Get agents by department
     */
    getAgentsByDepartment: async (departmentId) => {
        const response = await api.get(`/admin/departments/${departmentId}/agents`);
        return response.data;
    },

    /**
     * Get all agents
     */
    getAllAgents: async () => {
        const response = await api.get('/admin/departments/agents');
        return response.data;
    },

    /**
     * Create new department
     */
    createDepartment: async (departmentData) => {
        const response = await api.post('/admin/departments', departmentData);
        return response.data;
    },

    /**
     * Update department
     */
    updateDepartment: async (id, departmentData) => {
        const response = await api.put(`/admin/departments/${id}`, departmentData);
        return response.data;
    },

    /**
     * Delete department
     */
    deleteDepartment: async (id) => {
        const response = await api.delete(`/admin/departments/${id}`);
        return response.data;
    },

    /**
     * Toggle department active status
     */
    toggleDepartmentStatus: async (id) => {
        const response = await api.patch(`/admin/departments/${id}/toggle-status`);
        return response.data;
    }
};

export default departmentService;
