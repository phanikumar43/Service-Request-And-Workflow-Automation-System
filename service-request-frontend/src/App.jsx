import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminManageRequests from './pages/admin/AdminManageRequests';
import ServiceCatalogManagement from './pages/admin/ServiceCatalogManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import Reports from './pages/admin/Reports';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import SystemSettings from './pages/admin/SystemSettings';
import AuditLogs from './pages/admin/AuditLogs';
import CreateRequest from './pages/user/CreateRequest';
import MyRequests from './pages/MyRequests';
import RequestDetails from './pages/RequestDetails';
import ApproverDashboard from './pages/ApproverDashboard';
import AgentDashboard from './pages/AgentDashboard';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import Unauthorized from './pages/Unauthorized';
import authService from './services/authService';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

// Wrapper component for pages with layout
const PageWithLayout = ({ children }) => {
    return <Layout>{children}</Layout>;
};

// Root redirect component - redirects to appropriate dashboard based on role
const RootRedirect = () => {
    const dashboardRoute = authService.getDashboardRoute();
    return <Navigate to={dashboardRoute} replace />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true
                    }}
                >
                    <Routes>
                        {/* Public routes without layout */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Protected routes with layout - accessible to all authenticated users */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <Profile />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-request"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <CreateRequest />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-requests"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <MyRequests />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/requests"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <MyRequests />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/request/:id"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <RequestDetails />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin routes - require ROLE_ADMIN */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <AdminDashboard />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <UserManagement />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/requests"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <AdminManageRequests />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/service-catalog"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <ServiceCatalogManagement />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/categories"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <CategoryManagement />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/reports"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <Reports />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/departments"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <DepartmentManagement />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/settings"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <SystemSettings />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/audit-logs"
                            element={
                                <AdminRoute>
                                    <PageWithLayout>
                                        <AuditLogs />
                                    </PageWithLayout>
                                </AdminRoute>
                            }
                        />

                        {/* User routes - require ROLE_USER or ROLE_ADMIN */}
                        <Route
                            path="/user/dashboard"
                            element={
                                <UserRoute>
                                    <PageWithLayout>
                                        <UserDashboard />
                                    </PageWithLayout>
                                </UserRoute>
                            }
                        />

                        {/* Legacy dashboard route - redirect based on role */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <RootRedirect />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected routes with layout - accessible to all authenticated users */}
                        <Route
                            path="/create-request"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <CreateRequest />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-requests"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <MyRequests />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/requests"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <MyRequests />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/request/:id"
                            element={
                                <ProtectedRoute>
                                    <PageWithLayout>
                                        <RequestDetails />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Role-specific routes */}
                        <Route
                            path="/approvals"
                            element={
                                <ProtectedRoute requiredRole="ROLE_APPROVER">
                                    <PageWithLayout>
                                        <ApproverDashboard />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/department/dashboard"
                            element={
                                <ProtectedRoute requiredRole="ROLE_DEPARTMENT">
                                    <PageWithLayout>
                                        <DepartmentDashboard />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/tasks"
                            element={
                                <ProtectedRoute requiredRole="ROLE_AGENT">
                                    <PageWithLayout>
                                        <AgentDashboard />
                                    </PageWithLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Root redirect */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <RootRedirect />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
