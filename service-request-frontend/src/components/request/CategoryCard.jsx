import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Chip,
    Box
} from '@mui/material';
import * as Icons from '@mui/icons-material';

/**
 * Professional Category Card Component
 * Displays service category with icon, name, description, and service count
 */
const CategoryCard = ({ category, onClick, selected = false }) => {
    // Get the icon component dynamically
    const getIcon = (iconName) => {
        if (!iconName) return <Icons.Category />;
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent /> : <Icons.Category />;
    };

    return (
        <Card
            sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                border: selected ? '2px solid' : '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    borderColor: 'primary.main'
                }
            }}
        >
            <CardActionArea
                onClick={onClick}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2
                }}
            >
                <CardContent sx={{ width: '100%', p: 0 }}>
                    {/* Icon */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            bgcolor: selected ? 'primary.main' : 'primary.light',
                            color: selected ? 'white' : 'primary.main',
                            mb: 2,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {getIcon(category.icon)}
                    </Box>

                    {/* Category Name */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: selected ? 'primary.main' : 'text.primary'
                        }}
                    >
                        {category.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            minHeight: 40,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {category.description || 'No description available'}
                    </Typography>

                    {/* Service Count Badge */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={`${category.serviceCount || 0} services`}
                            size="small"
                            color={selected ? 'primary' : 'default'}
                            sx={{ fontWeight: 500 }}
                        />
                        {category.department && (
                            <Chip
                                label={category.department}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 500 }}
                            />
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CategoryCard;
