import React, { useState, useEffect } from 'react';
import serviceCatalogService from '../../services/serviceCatalogService';
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
    CircularProgress
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Category as CategoryIcon
} from '@mui/icons-material';

/**
 * Service Catalog Management Page
 * Admin page for managing services and categories
 */
const ServiceCatalogManagement = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [serviceForm, setServiceForm] = useState({
        name: '',
        description: '',
        categoryId: '',
        defaultPriority: 'MEDIUM',
        department: '',
        slaHours: '',
        isActive: true,
        requiresApproval: false
    });

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        icon: '',
        isActive: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [servicesData, categoriesData] = await Promise.all([
                serviceCatalogService.getAllServices(),
                serviceCatalogService.getAllCategories()
            ]);
            setServices(servicesData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (service = null) => {
        if (service) {
            setEditingService(service);
            setServiceForm({
                name: service.name,
                description: service.description || '',
                categoryId: service.categoryId,
                defaultPriority: service.defaultPriority || 'MEDIUM',
                department: service.department || '',
                slaHours: service.slaHours || '',
                isActive: service.isActive,
                requiresApproval: service.requiresApproval
            });
        } else {
            setEditingService(null);
            setServiceForm({
                name: '',
                description: '',
                categoryId: '',
                defaultPriority: 'MEDIUM',
                department: '',
                slaHours: '',
                isActive: true,
                requiresApproval: false
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
    };

    const handleSaveService = async () => {
        try {
            setError('');
            if (editingService) {
                await serviceCatalogService.updateService(editingService.id, serviceForm);
                setSuccess('Service updated successfully');
            } else {
                await serviceCatalogService.createService(serviceForm);
                setSuccess('Service created successfully');
            }
            handleCloseDialog();
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save service');
        }
    };

    const handleDeleteService = async (id) => {
        if (window.confirm('Are you sure you want to disable this service?')) {
            try {
                await serviceCatalogService.deleteService(id);
                setSuccess('Service disabled successfully');
                loadData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to disable service');
            }
        }
    };

    const handleOpenCategoryDialog = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                name: category.name,
                description: category.description || '',
                icon: category.icon || '',
                isActive: category.isActive
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({
                name: '',
                description: '',
                icon: '',
                isActive: true
            });
        }
        setOpenCategoryDialog(true);
    };

    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
        setEditingCategory(null);
    };

    const handleSaveCategory = async () => {
        try {
            setError('');
            if (editingCategory) {
                await serviceCatalogService.updateCategory(editingCategory.id, categoryForm);
                setSuccess('Category updated successfully');
            } else {
                await serviceCatalogService.createCategory(categoryForm);
                setSuccess('Category created successfully');
            }
            handleCloseCategoryDialog();
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        }
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
                    <Typography variant="h4">Service Catalog Management</Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<CategoryIcon />}
                            onClick={() => handleOpenCategoryDialog()}
                            sx={{ mr: 2 }}
                        >
                            Manage Categories
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add Service
                        </Button>
                    </Box>
                </Box>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Service Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>SLA (Hours)</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>{service.name}</TableCell>
                                    <TableCell>{service.categoryName}</TableCell>
                                    <TableCell>{service.department || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={service.defaultPriority}
                                            size="small"
                                            color={
                                                service.defaultPriority === 'HIGH' ? 'error' :
                                                    service.defaultPriority === 'MEDIUM' ? 'warning' : 'default'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{service.slaHours || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={service.isActive ? 'Active' : 'Inactive'}
                                            size="small"
                                            color={service.isActive ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(service)}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteService(service.id)}
                                            disabled={!service.isActive}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Service Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Service Name"
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <TextField
                                select
                                label="Category"
                                value={serviceForm.categoryId}
                                onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                                required
                                fullWidth
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Default Priority"
                                value={serviceForm.defaultPriority}
                                onChange={(e) => setServiceForm({ ...serviceForm, defaultPriority: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                                <MenuItem value="CRITICAL">Critical</MenuItem>
                            </TextField>
                            <TextField
                                label="Department"
                                value={serviceForm.department}
                                onChange={(e) => setServiceForm({ ...serviceForm, department: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="SLA Hours"
                                type="number"
                                value={serviceForm.slaHours}
                                onChange={(e) => setServiceForm({ ...serviceForm, slaHours: e.target.value })}
                                fullWidth
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={serviceForm.isActive}
                                        onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                                    />
                                }
                                label="Active"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={serviceForm.requiresApproval}
                                        onChange={(e) => setServiceForm({ ...serviceForm, requiresApproval: e.target.checked })}
                                    />
                                }
                                label="Requires Approval"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveService} variant="contained">
                            {editingService ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Category Dialog */}
                <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Category Name"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <TextField
                                label="Icon"
                                value={categoryForm.icon}
                                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                                fullWidth
                                helperText="Material-UI icon name (e.g., Computer, Build)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={categoryForm.isActive}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                                    />
                                }
                                label="Active"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
                        <Button onClick={handleSaveCategory} variant="contained">
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default ServiceCatalogManagement;
