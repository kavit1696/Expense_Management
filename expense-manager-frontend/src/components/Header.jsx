import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ profilePath = '/dashboard/profile' }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-user-section">
                <div
                    className="header-user-profile"
                    onClick={() => navigate(profilePath)}
                >
                    <div className="user-info text-right">
                        <p className="user-name">{user?.UserName || 'User'}</p>
                        <p className="user-email">{user?.EmailAddress || 'user@system.com'}</p>
                    </div>
                    <div className="user-avatar">
                        {user?.UserName?.charAt(0).toUpperCase() || <User size={20} />}
                    </div>
                </div>
                <button onClick={handleLogout} className="header-logout-btn" title="Sign Out">
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header;
