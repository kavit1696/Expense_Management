import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        UserName: '',
        EmailAddress: '',
        Password: '',
        MobileNo: '',
        ProfileImage: 'default.png' // Default value
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register({ ...formData, Role: 'user' });

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-card fade-in">

                    {/* macOS Style Avatar */}
                    <div className="login-avatar">
                        <UserPlus size={48} />
                    </div>

                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Sign up to start tracking your expenses</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                        {error && <div className="text-danger text-center" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                        <div className="form-group">
                            <Input
                                name="UserName"
                                placeholder="Enter Full Name"
                                value={formData.UserName}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                name="EmailAddress"
                                type="email"
                                placeholder="Enter Email Address"
                                value={formData.EmailAddress}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                name="Password"
                                type="password"
                                placeholder="Enter Password"
                                value={formData.Password}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                name="MobileNo"
                                placeholder="Enter Mobile Number"
                                value={formData.MobileNo}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <Button type="submit" style={{ width: '100%', borderRadius: '12px' }} className="btn-primary" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                                Already have an account? <span style={{ color: '#fff', fontWeight: 'bold' }}>Login</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
