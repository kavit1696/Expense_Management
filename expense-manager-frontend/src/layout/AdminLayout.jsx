import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Users,
    LogOut,
    LayoutDashboard,
    FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'My Reports', path: '/admin/my-reports', icon: <FileText size={20} /> },
    ];

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">EM</div>
                    <div className="logo-text">
                        <h1>Expense Manager</h1>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-label">Management</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.name === 'Dashboard'}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                <Header profilePath="/admin/profile" />
                <div className="layout-content fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
