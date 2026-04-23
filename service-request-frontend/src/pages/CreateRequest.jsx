import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
    Alert,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import catalogService from '../services/catalogService';
import requestService from '../services/requestService';

const steps = ['Select Service', 'Request Details', 'Review & Submit'];

const CreateRequest = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        categoryId: '',
        serviceId: '',
        title: '',
        description: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        loadCategories();
        loadServices();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await catalogService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const loadServices = async () => {
        try {
            const data = await catalogService.getServices();
            setServices(data);
            setFilteredServices(data);
        } catch (err) {
            console.error('Error loading services:', err);
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setFormData({ ...formData, categoryId, serviceId: '' });

        if (categoryId) {
            const filtered = services.filter(s => s.category.id === parseInt(categoryId));
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        if (activeStep === 0 && !formData.serviceId) {
            setError('Please select a service');
            return;
        }
        if (activeStep === 1 && (!formData.title || !formData.description)) {
            setError('Please fill in all required fields');
            return;
        }
        setError('');
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const requestData = {
                serviceId: parseInt(formData.serviceId),
                title: formData.title,
                description: formData.description,
                priority: formData.priority
            };
            console.log("Submitting Request:", requestData);
            const response = await requestService.createRequest(requestData);
            console.log("Create Request Response:", response);
            setSuccess(true);
            setTimeout(() => {
                navigate('/my-requests', { replace: true, state: { reload: true } });
            }, 1500); // Reduced timeout for faster redirect
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    const selectedService = services.find(s => s.id === parseInt(formData.serviceId));

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Create Service Request
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Request created successfully! Redirecting...
                        </Alert>
                    )}

                    {/* Step 1: Select Service */}
                    {activeStep === 0 && (
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Category"
                                        value={formData.categoryId}
                                        onChange={handleCategoryChange}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        required
                                        label="Service"
                                        name="serviceId"
                                        value={formData.serviceId}
                                        onChange={handleChange}
                                    >
                                        {filteredServices.map((service) => (
                                            <MenuItem key={service.id} value={service.id}>
                                                {service.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                {selectedService && (
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Service Description:
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedService.description || 'No description available'}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}

                    {/* Step 2: Request Details */}
                    {activeStep === 1 && (
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Request Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Brief description of your issue"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        multiline
                                        rows={6}
                                        label="Detailed Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Please provide detailed information about your request..."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        required
                                        label="Priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="LOW">Low</MenuItem>
                                        <MenuItem value="MEDIUM">Medium</MenuItem>
                                        <MenuItem value="HIGH">High</MenuItem>
                                        <MenuItem value="CRITICAL">Critical</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Step 3: Review */}
                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Review Your Request
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Service:
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedService?.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Title:
                                    </Typography>
                                    <Typography variant="body1">{formData.title}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Description:
                                    </Typography>
                                    <Typography variant="body1">{formData.description}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Priority:
                                    </Typography>
                                    <Typography variant="body1">{formData.priority}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Box>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/dashboard')}
                                sx={{ mr: 1 }}
                            >
                                Cancel
                            </Button>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default CreateRequest;
