import api from '../api/axios';

/**
 * Task Service
 * Handles task API calls for agents
 */
const taskService = {
    /**
     * Get my tasks
     */
    getMyTasks: async (page = 0, size = 10) => {
        const response = await api.get('/tasks/my-tasks', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get pending tasks
     */
    getPendingTasks: async () => {
        const response = await api.get('/tasks/pending');
        return response.data;
    },

    /**
     * Get task by ID
     */
    getTaskById: async (id) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    /**
     * Update task status
     */
    updateTaskStatus: async (id, status) => {
        const response = await api.patch(`/tasks/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    /**
     * Complete task
     */
    completeTask: async (id, resolutionNotes) => {
        const response = await api.post(`/tasks/${id}/complete`, resolutionNotes);
        return response.data;
    },

    /**
     * Update task notes
     */
    updateTaskNotes: async (id, notes) => {
        const response = await api.put(`/tasks/${id}/notes`, notes);
        return response.data;
    }
};

export default taskService;
