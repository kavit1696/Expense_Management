import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Users,
    LogOut,
    LayoutDashboard,
    FileText,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'My Reports', path: '/admin/my-reports', icon: <FileText size={20} /> },
    ];

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="app-layout">
            {/* Sidebar Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="sidebar-overlay active"
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-icon">EM</div>
                    <div className="logo-text">
                        <h1>Expense Manager</h1>
                    </div>
                    {isMobileMenuOpen && (
                        <button className="mobile-close-btn" onClick={closeMobileMenu} aria-label="Close menu">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-label">Management</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.name === 'Dashboard'}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={closeMobileMenu}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                <Header
                    profilePath="/admin/profile"
                    onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <div className="layout-content fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
