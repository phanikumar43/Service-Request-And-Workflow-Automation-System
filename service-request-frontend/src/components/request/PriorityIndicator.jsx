import React from 'react';
import { Chip } from '@mui/material';
import {
    ArrowDownward,
    ArrowUpward,
    PriorityHigh,
    Warning
} from '@mui/icons-material';

/**
 * Priority Indicator Component
 * Displays color-coded priority indicators
 */
const PriorityIndicator = ({ priority }) => {
    const getPriorityConfig = (priority) => {
        const configs = {
            'LOW': {
                color: 'success',
                icon: <ArrowDownward sx={{ fontSize: 16 }} />,
                label: 'Low'
            },
            'MEDIUM': {
                color: 'warning',
                icon: <Warning sx={{ fontSize: 16 }} />,
                label: 'Medium'
            },
            'HIGH': {
                color: 'error',
                icon: <ArrowUpward sx={{ fontSize: 16 }} />,
                label: 'High'
            },
            'CRITICAL': {
                color: 'error',
                icon: <PriorityHigh sx={{ fontSize: 16 }} />,
                label: 'Critical'
            }
        };
        return configs[priority] || configs['MEDIUM'];
    };

    const config = getPriorityConfig(priority);

    return (
        <Chip
            icon={config.icon}
            label={config.label}
            color={config.color}
            size="small"
            variant={priority === 'CRITICAL' ? 'filled' : 'outlined'}
        />
    );
};

export default PriorityIndicator;
