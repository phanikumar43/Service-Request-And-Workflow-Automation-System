import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Paper,
    CircularProgress,
    Skeleton,
    Chip
} from '@mui/material';
import CategoryCard from '../../components/request/CategoryCard';
import categoryService from '../../services/categoryService';
import requestService from '../../services/requestService';

/**
 * Create Request Page
 * Step 1: Select Category
 * Step 2: Select Request Type
 * Step 3: Fill Request Form
 * Step 4: Submit Request
 */
const CreateRequest = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [requestTypes, setRequestTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedRequestType, setSelectedRequestType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingRequestTypes, setLoadingRequestTypes] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        console.log('🔄 Loading categories...');
        try {
            setLoadingCategories(true);
            setError('');
            const data = await categoryService.getCategories();

            if (!data || data.length === 0) {
                console.warn('⚠️ No categories returned from API');
                setError('No service categories available. Please contact your administrator.');
            } else {
                console.log(`✅ Loaded ${data.length} categories`);
                setCategories(data);
            }
        } catch (err) {
            console.error('❌ Error loading categories:', err);
            console.error('Error response:', err.response);
            setError('Failed to load categories. Please try again or contact support.');
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCategorySelect = async (category) => {
        console.log('🔄 Category selected:', category.name, '(ID:', category.id, ')');
        setSelectedCategory(category);
        setSelectedRequestType(null);
        setRequestTypes([]);
        setError('');
        setLoadingRequestTypes(true);

        try {
            console.log(`📡 Loading request types for category ${category.id}...`);
            const typesData = await categoryService.getCategoryTypes(category.id);

            if (!typesData || typesData.length === 0) {
                console.warn(`⚠️ No request types found for category: ${category.name}`);
                setError(`No request types available for ${category.name}. Please select another category or contact support.`);
            } else {
                console.log(`✅ Loaded ${typesData.length} request types for ${category.name}`);
                setRequestTypes(typesData);
            }
        } catch (err) {
            console.error(`❌ Error loading request types for category ${category.id}:`, err);
            console.error('Error response:', err.response);
            setError(`Failed to load request types for ${category.name}. Please try again.`);
        } finally {
            setLoadingRequestTypes(false);
        }
    };

    const handleRequestTypeSelect = (requestType) => {
        console.log('🔄 Request type selected:', requestType.name, '(ID:', requestType.id, ')');
        setSelectedRequestType(requestType);
        // Auto-fill priority if available
        if (requestType.defaultPriority) {
            setFormData({
                ...formData,
                priority: requestType.defaultPriority
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedRequestType) {
            setError('Please select a request type');
            return;
        }

        if (!formData.title.trim()) {
            setError('Please enter a title for your request');
            return;
        }

        if (!formData.description.trim()) {
            setError('Please enter a description for your request');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const requestData = {
                serviceId: selectedRequestType.id,
                categoryId: selectedCategory.id,
                title: formData.title,
                description: formData.description,
                priority: formData.priority
            };

            console.log('📤 Submitting request:', requestData);
            const response = await requestService.createRequest(requestData);
            console.log('✅ Request created successfully:', response);

            navigate('/my-requests', { replace: true, state: { reload: true } });
        } catch (err) {
            console.error('❌ Error creating request:', err);
            console.error('Error response:', err.response);
            setError(err.response?.data?.message || 'Failed to create request. Please try again.');
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (selectedRequestType) {
            setSelectedRequestType(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
            setRequestTypes([]);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Create New Request
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {/* Step 1: Select Category */}
                {!selectedCategory && (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                            Step 1: Select Category
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                            Choose a category that best describes your request
                        </Typography>

                        {loadingCategories ? (
                            <Grid container spacing={3}>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={item}>
                                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : categories.length === 0 ? (
                            <Alert severity="info">
                                No categories available at the moment. Please contact support.
                            </Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {categories.map((category) => (
                                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                                        <CategoryCard
                                            category={category}
                                            onClick={() => handleCategorySelect(category)}
                                            selected={false}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}

                {/* Step 2: Select Request Type */}
                {selectedCategory && !selectedRequestType && (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                            Step 2: Select Request Type
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Category: <strong>{selectedCategory.name}</strong>
                        </Typography>

                        {loadingRequestTypes ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress />
                                <Typography variant="body2" sx={{ ml: 2, mt: 1 }}>
                                    Loading request types...
                                </Typography>
                            </Box>
                        ) : requestTypes.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No request types available for this category at the moment.
                            </Alert>
                        ) : (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {requestTypes.map((requestType) => (
                                    <Grid item xs={12} key={requestType.id}>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    elevation: 3,
                                                    transform: 'translateY(-2px)',
                                                    borderColor: 'primary.main',
                                                    boxShadow: 3
                                                }
                                            }}
                                            onClick={() => handleRequestTypeSelect(requestType)}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6">
                                                        {requestType.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {requestType.description || 'No description available'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 2 }}>
                                                    {requestType.isActive && (
                                                        <Chip
                                                            label="Active"
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        <Button onClick={handleBack} sx={{ mt: 2 }} variant="outlined">
                            Back to Categories
                        </Button>
                    </Box>
                )}

                {/* Step 3: Request Details */}
                {selectedRequestType && (
                    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Step 3: Request Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Category: <strong>{selectedCategory.name}</strong> → Request Type: <strong>{selectedRequestType.name}</strong>
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Title *"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Brief summary of your request"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description *"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                        required
                                        placeholder="Detailed description of your request"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Priority *</InputLabel>
                                        <Select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            label="Priority *"
                                        >
                                            <MenuItem value="LOW">Low</MenuItem>
                                            <MenuItem value="MEDIUM">Medium</MenuItem>
                                            <MenuItem value="HIGH">High</MenuItem>
                                            <MenuItem value="CRITICAL">Critical</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Category"
                                        value={selectedCategory.name}
                                        disabled
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button onClick={handleBack} variant="outlined" disabled={loading}>
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ flex: 1 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default CreateRequest;
