import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    MenuItem,
    Button
} from '@mui/material';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Assessment, TrendingUp, Category, PriorityHigh, Refresh } from '@mui/icons-material';
import reportsService from '../../services/reportsService';
import { format, subDays, subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState(null);
    const [statusData, setStatusData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [priorityData, setPriorityData] = useState([]);
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [dateRange, setDateRange] = useState('30days');

    useEffect(() => {
        loadReports();
    }, [dateRange]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const { startDate, endDate } = getDateRange();

            // Load all reports data
            const [stats, byStatus, byCategory, byPriority, overTime] = await Promise.all([
                reportsService.getStatistics(startDate, endDate),
                reportsService.getRequestsByStatus(startDate, endDate),
                reportsService.getRequestsByCategory(startDate, endDate),
                reportsService.getRequestsByPriority(startDate, endDate),
                reportsService.getRequestsOverTime(startDate, endDate, 'day')
            ]);

            setStatistics(stats);
            setStatusData(Object.entries(byStatus).map(([name, value]) => ({ name, value })));
            setCategoryData(Object.entries(byCategory).map(([name, value]) => ({ name, value })));
            setPriorityData(Object.entries(byPriority).map(([name, value]) => ({ name, value })));

            // Convert time series data
            if (overTime.data) {
                const timeData = Object.entries(overTime.data).map(([date, count]) => ({
                    date,
                    requests: count
                }));
                setTimeSeriesData(timeData);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDateRange = () => {
        const endDate = new Date().toISOString();
        let startDate;

        switch (dateRange) {
            case '7days':
                startDate = subDays(new Date(), 7).toISOString();
                break;
            case '30days':
                startDate = subDays(new Date(), 30).toISOString();
                break;
            case '3months':
                startDate = subMonths(new Date(), 3).toISOString();
                break;
            case '6months':
                startDate = subMonths(new Date(), 6).toISOString();
                break;
            case 'all':
            default:
                startDate = null;
        }

        return { startDate, endDate };
    };

    const statCards = [
        {
            title: 'Total Requests',
            value: statistics?.totalRequests || 0,
            icon: <Assessment />,
            color: '#1976d2'
        },
        {
            title: 'Pending',
            value: statistics?.pendingRequests || 0,
            icon: <TrendingUp />,
            color: '#ff9800'
        },
        {
            title: 'In Progress',
            value: statistics?.inProgressRequests || 0,
            icon: <Category />,
            color: '#2196f3'
        },
        {
            title: 'Resolved',
            value: statistics?.resolvedRequests || 0,
            icon: <PriorityHigh />,
            color: '#4caf50'
        }
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Reports & Analytics
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        select
                        size="small"
                        label="Date Range"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="7days">Last 7 Days</MenuItem>
                        <MenuItem value="30days">Last 30 Days</MenuItem>
                        <MenuItem value="3months">Last 3 Months</MenuItem>
                        <MenuItem value="6months">Last 6 Months</MenuItem>
                        <MenuItem value="all">All Time</MenuItem>
                    </TextField>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadReports}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ color: stat.color, mr: 2 }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h6" component="div">
                                        {stat.title}
                                    </Typography>
                                </Box>
                                <Typography variant="h3" component="div" sx={{ color: stat.color }}>
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Average Resolution Time */}
            {statistics?.averageResolutionTimeHours > 0 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Average Resolution Time
                    </Typography>
                    <Typography variant="h4" color="primary">
                        {statistics.averageResolutionTimeHours.toFixed(1)} hours
                    </Typography>
                </Paper>
            )}

            {/* Charts */}
            <Grid container spacing={3}>
                {/* Requests Over Time */}
                {timeSeriesData.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Requests Over Time
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={timeSeriesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}

                {/* Requests by Status */}
                {statusData.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Requests by Status
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}

                {/* Requests by Priority */}
                {priorityData.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Requests by Priority
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={priorityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}

                {/* Requests by Category */}
                {categoryData.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Requests by Category
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default Reports;
