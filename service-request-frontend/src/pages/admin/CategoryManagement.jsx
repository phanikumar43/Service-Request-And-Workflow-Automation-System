import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    Alert,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    ToggleOn,
    ToggleOff,
    Category as CategoryIcon
} from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import serviceCatalogService from '../../services/serviceCatalogService';

/**
 * Category Management Page
 * Admin page for managing service categories
 */
const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        icon: 'Category',
        department: '',
        isActive: true
    });

    // Common Material-UI icon names for categories
    const iconOptions = [
        'Category', 'Computer', 'Build', 'Business', 'People',
        'Settings', 'Security', 'Storage', 'Cloud', 'Phone',
        'Email', 'Print', 'Wifi', 'Lock', 'VpnKey',
        'AccountBalance', 'Assignment', 'Description', 'Folder', 'Work'
    ];

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await serviceCatalogService.getAdminCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                name: category.name,
                description: category.description || '',
                icon: category.icon || 'Category',
                department: category.department || '',
                isActive: category.isActive
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({
                name: '',
                description: '',
                icon: 'Category',
                department: '',
                isActive: true
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCategory(null);
        setError('');
    };

    const handleSaveCategory = async () => {
        try {
            setError('');

            // Validation
            if (!categoryForm.name.trim()) {
                setError('Category name is required');
                return;
            }

            if (editingCategory) {
                await serviceCatalogService.updateCategoryAdmin(editingCategory.id, categoryForm);
                setSuccess('Category updated successfully');
            } else {
                await serviceCatalogService.createCategoryAdmin(categoryForm);
                setSuccess('Category created successfully');
            }

            handleCloseDialog();
            loadCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save category';
            setError(errorMessage);
            console.error('Error saving category:', err);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await serviceCatalogService.toggleCategoryStatus(id);
            setSuccess('Category status updated successfully');
            loadCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update category status');
            console.error('Error toggling status:', err);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to disable this category? Users will no longer see it.')) {
            try {
                await serviceCatalogService.deleteCategory(id);
                setSuccess('Category disabled successfully');
                loadCategories();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to disable category');
                console.error('Error deleting category:', err);
            }
        }
    };

    // Get icon component for preview
    const getIconComponent = (iconName) => {
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent /> : <CategoryIcon />;
    };

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Category Management</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Category
                    </Button>
                </Box>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                {error && !openDialog && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Icon</TableCell>
                                <TableCell>Category Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Services</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                            No categories found. Create your first category to get started.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                                {getIconComponent(category.icon)}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight={500}>
                                                {category.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.description || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{category.department || '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={category.serviceCount || 0}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={category.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                color={category.isActive ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(category)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={category.isActive ? 'Disable' : 'Enable'}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleToggleStatus(category.id)}
                                                >
                                                    {category.isActive ? <ToggleOn color="success" /> : <ToggleOff />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    disabled={!category.isActive}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Category Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Category Name"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                required
                                fullWidth
                                helperText="Unique name for the category"
                            />
                            <TextField
                                label="Description"
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                multiline
                                rows={3}
                                fullWidth
                                helperText="Brief description of what this category covers"
                            />
                            <TextField
                                select
                                label="Icon"
                                value={categoryForm.icon}
                                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                                fullWidth
                                helperText="Icon to display for this category"
                            >
                                {iconOptions.map((icon) => (
                                    <MenuItem key={icon} value={icon}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getIconComponent(icon)}
                                            <Typography>{icon}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Department"
                                value={categoryForm.department}
                                onChange={(e) => setCategoryForm({ ...categoryForm, department: e.target.value })}
                                fullWidth
                                helperText="Department responsible for this category (optional)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={categoryForm.isActive}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                                    />
                                }
                                label="Active (visible to users)"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveCategory} variant="contained">
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default CategoryManagement;
