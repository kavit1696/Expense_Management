import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { Wallet, User } from 'lucide-react';

const Login = ({ embedded = false }) => {
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (email && password) {
            const result = await login(email, password);
            if (result.success) {
                const loggedInUser = result.user;

                // Enforce Role Check
                if (role === 'admin' && loggedInUser.Role !== 'admin') {
                    setError("Invalid email or password");
                    setLoading(false);
                    return;
                }

                if (role === 'user' && loggedInUser.Role === 'admin') {
                    setError("Invalid email or password");
                    setLoading(false);
                    return;
                }

                // Redirect based on actual user role
                if (loggedInUser.Role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className={embedded ? "" : "auth-container"} style={embedded ? { display: 'flex', justifyContent: 'center', width: '100%' } : {}}>
            <div className="auth-content">
                <div className="auth-card fade-in">

                    {/* macOS Style Avatar */}
                    <div className="login-avatar">
                        <User size={48} />
                    </div>

                    <div className="auth-header">
                        <h2>{userRoleDisplay()}</h2>
                        <p>{role === 'admin' ? 'System Administrator' : 'Standard User'}</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                        {error && <div className="text-danger text-center" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                        {/* Segmented Control for Role */}
                        <div className="text-center">
                            <div className="role-toggle">
                                <button
                                    type="button"
                                    className={role === 'user' ? 'active' : ''}
                                    onClick={() => setRole('user')}
                                >
                                    User
                                </button>
                                <button
                                    type="button"
                                    className={role === 'admin' ? 'active' : ''}
                                    onClick={() => setRole('admin')}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <input
                                placeholder="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <Button type="submit" style={{ width: '100%', borderRadius: '12px' }} className="btn-primary" disabled={loading}>
                                {loading ? 'Logging In...' : 'Enter'}
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => navigate('/register')}>
                                Create new account
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Helper for display
const userRoleDisplay = () => "Expense Manager";

export default Login;
