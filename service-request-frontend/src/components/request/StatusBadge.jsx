import React from 'react';
import { Chip } from '@mui/material';

/**
 * Status Badge Component
 * Displays color-coded status badges for requests
 */
const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        const colors = {
            'NEW': 'primary',
            'PENDING_APPROVAL': 'warning',
            'APPROVED': 'success',
            'REJECTED': 'error',
            'ASSIGNED': 'info',
            'IN_PROGRESS': 'warning',
            'RESOLVED': 'success',
            'CLOSED': 'default',
            'CANCELLED': 'error'
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        return status.replace(/_/g, ' ');
    };

    return (
        <Chip
            label={getStatusLabel(status)}
            color={getStatusColor(status)}
            size="small"
            sx={{ fontWeight: 'bold' }}
        />
    );
};

export default StatusBadge;
