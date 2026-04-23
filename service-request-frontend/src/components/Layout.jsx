import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService, { ROLES } from '../services/authService';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Badge
} from '@mui/material';
import {
    AccountCircle,
    Notifications,
    Dashboard as DashboardIcon,
    Assignment,
    Approval,
    Work,
    People,
    Category,
    Folder,
    Add,
    Person,
    BarChart,
    Business,
    Settings,
    History
} from '@mui/icons-material';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, hasRole } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                        Service Desk
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                        {/* Dashboard button - route based on role */}
                        <Button
                            color="inherit"
                            startIcon={<DashboardIcon />}
                            onClick={() => {
                                const dashboardRoute = authService.getDashboardRoute();
                                navigate(dashboardRoute);
                            }}
                            sx={{
                                backgroundColor: (isActive('/dashboard') || isActive('/admin/dashboard') || isActive('/user/dashboard')) ? 'rgba(255,255,255,0.1)' : 'transparent'
                            }}
                        >
                            Dashboard
                        </Button>

                        {/* Admin navigation */}
                        {authService.hasRole(ROLES.ADMIN) && (
                            <>
                                <Button
                                    color="inherit"
                                    startIcon={<People />}
                                    onClick={() => navigate('/admin/users')}
                                    sx={{
                                        backgroundColor: isActive('/admin/users') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    Users
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<Category />}
                                    onClick={() => navigate('/admin/service-catalog')}
                                    sx={{
                                        backgroundColor: isActive('/admin/service-catalog') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    Service Catalog
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<Folder />}
                                    onClick={() => navigate('/admin/categories')}
                                    sx={{
                                        backgroundColor: isActive('/admin/categories') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    Categories
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<Assignment />}
                                    onClick={() => navigate('/admin/requests')}
                                    sx={{
                                        backgroundColor: isActive('/admin/requests') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    All Requests
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<BarChart />}
                                    onClick={() => navigate('/admin/reports')}
                                    sx={{
                                        backgroundColor: isActive('/admin/reports') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    Reports
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<Business />}
                                    onClick={() => navigate('/admin/departments')}
                                    sx={{
                                        backgroundColor: isActive('/admin/departments') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    Departments
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<Settings />}
                                    onClick={() => navigate('/admin/settings')}
                                    sx={{
                                        backgroundColor: isActive('/admin/settings') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    Settings
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<History />}
                                    onClick={() => navigate('/admin/audit-logs')}
                                    sx={{
                                        backgroundColor: isActive('/admin/audit-logs') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    Audit Logs
                                </Button>
                            </>
                        )}

                        {/* User navigation */}
                        {(authService.hasRole(ROLES.USER) || authService.hasRole(ROLES.END_USER)) && !authService.hasRole(ROLES.ADMIN) && (
                            <>
                                <Button
                                    color="inherit"
                                    startIcon={<Add />}
                                    onClick={() => navigate('/create-request')}
                                    sx={{
                                        backgroundColor: isActive('/create-request') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    New Request
                                </Button>
                                <Button
                                    color="inherit"
                                    startIcon={<Assignment />}
                                    onClick={() => navigate('/my-requests')}
                                    sx={{
                                        backgroundColor: isActive('/my-requests') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    My Requests
                                </Button>
                            </>
                        )}

                        {/* Approver navigation */}
                        {hasRole('ROLE_APPROVER') && (
                            <Button
                                color="inherit"
                                startIcon={<Approval />}
                                onClick={() => navigate('/approvals')}
                                sx={{
                                    backgroundColor: isActive('/approvals') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                }}
                            >
                                Approvals
                            </Button>
                        )}

                        {/* Agent navigation */}
                        {hasRole('ROLE_AGENT') && (
                            <Button
                                color="inherit"
                                startIcon={<Work />}
                                onClick={() => navigate('/tasks')}
                                sx={{
                                    backgroundColor: isActive('/tasks') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                }}
                            >
                                My Tasks
                            </Button>
                        )}

                        {/* Department navigation */}
                        {hasRole('ROLE_DEPARTMENT') && (
                            <Button
                                color="inherit"
                                startIcon={<DashboardIcon />}
                                onClick={() => navigate('/department/dashboard')}
                                sx={{
                                    backgroundColor: isActive('/department/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent'
                                }}
                            >
                                Dept Dashboard
                            </Button>
                        )}
                    </Box>

                    <IconButton color="inherit" sx={{ mr: 1 }}>
                        <Badge badgeContent={0} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <IconButton
                        size="large"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem disabled>
                            <Typography variant="body2">
                                {user?.username}
                            </Typography>
                        </MenuItem>
                        <MenuItem disabled>
                            <Typography variant="caption" color="text.secondary">
                                {user?.roles?.join(', ')}
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                navigate('/profile');
                            }}
                        >
                            <Person sx={{ mr: 1 }} />
                            My Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5' }}>
                {children}
            </Box>

            <Box component="footer" sx={{ py: 2, px: 3, bgcolor: '#1976d2', color: 'white', textAlign: 'center' }}>
                <Typography variant="body2">
                    Service Request System © 2024 - Enterprise Workflow Automation
                </Typography>
            </Box>
        </Box>
    );
};

export default Layout;
