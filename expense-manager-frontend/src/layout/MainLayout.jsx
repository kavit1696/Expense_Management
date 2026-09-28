import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    FolderKanban,
    PieChart,
    LogOut,
    Tags,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const MainLayout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Expenses', path: '/dashboard/expenses', icon: <Wallet size={20} /> },
        { name: 'Income', path: '/dashboard/incomes', icon: <TrendingUp size={20} /> },
        { name: 'Categories', path: '/dashboard/categories', icon: <Tags size={20} /> },
        { name: 'Projects & Staff', path: '/dashboard/projects', icon: <FolderKanban size={20} /> },
        { name: 'Reports', path: '/dashboard/reports', icon: <PieChart size={20} /> },
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
                    <p className="nav-label">Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard' || item.path === '/admin/dashboard'}
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
                    profilePath="/dashboard/profile"
                    onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <div className="layout-content fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
