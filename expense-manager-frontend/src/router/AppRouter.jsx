import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AdminLayout from '../layout/AdminLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Incomes from '../pages/Incomes';
import Projects from '../pages/Projects';
import Reports from '../pages/Reports';
import Categories from '../pages/Categories';
import UserDetails from '../pages/admin/UserDetails';
import AdminReports from '../pages/admin/AdminReports';
import UserProfile from '../pages/UserProfile';
import Explore from '../pages/Explore';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // If route requires a specific role (like 'admin') and user doesn't have it
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/dashboard" replace />; // Redirect unauthorized admins/users to home
    }

    return children;
};

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes - Accessible by 'user' (and admins who want to see their own data? debatable, but usually fine) */}
            <Route path="/" element={<Explore />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="incomes" element={<Incomes />} />
                <Route path="categories" element={<Categories />} />
                <Route path="projects" element={<Projects />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Admin Routes - Strictly 'admin' only */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin">
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="my-reports" element={<AdminReports />} />
                <Route path="userdetails/:id" element={<UserDetails />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="incomes" element={<Incomes />} />
                <Route path="categories" element={<Categories />} />
                <Route path="projects" element={<Projects />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRouter;
