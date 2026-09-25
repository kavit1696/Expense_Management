import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        UserName: '',
        EmailAddress: '',
        Password: '',
        MobileNo: '',
        Role: 'user'
    });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data?.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u.UserID !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleOpenSideCard = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                ...user,
                UserName: user.UserName || '',
                EmailAddress: user.EmailAddress || '',
                Password: '', // Don't show password
                MobileNo: user.MobileNo || '',
                Role: user.Role || 'user'
            });
        } else {
            setEditingUser(null);
            setFormData({
                UserName: '',
                EmailAddress: '',
                Password: '',
                MobileNo: '',
                Role: 'user'
            });
        }
        setIsSidebarOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const payload = { ...formData };
                if (!payload.Password) delete payload.Password;
                await api.patch(`/users/${editingUser.UserID}`, payload);
            } else {
                await api.post('/users', formData);
            }
            setIsSidebarOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Failed to save user details.");
        }
    };

    if (loading) return (
        <div className="dashboard-container">
            <div className="text-muted">Loading System Users...</div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>User Management</h1>
                    <p className="text-muted">Manage system users, roles, and access permissions.</p>
                </div>
                {!isSidebarOpen && (
                    <Button onClick={() => handleOpenSideCard()} className="flex items-center gap-2">
                        <Plus size={18} /> Add User
                    </Button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative' }}>
                {/* Main List Column */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Card>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th className="hide-mobile">Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(user => user.Role !== 'admin').map(user => (
                                        <tr
                                            key={user.UserID}
                                            onClick={() => navigate(`/admin/userdetails/${user.UserID}`)}
                                            style={{ cursor: 'pointer' }}
                                            className={`${editingUser?.UserID === user.UserID ? 'active-row' : ''}`}
                                        >
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="user-avatar-sm" style={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: 'var(--primary-light)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'var(--primary)', fontWeight: 'bold',
                                                        fontSize: '0.8rem',
                                                        border: '1px solid var(--border-color)'
                                                    }}>
                                                        {user.UserName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{user.UserName}</span>
                                                </div>
                                            </td>
                                            <td className="text-muted">{user.EmailAddress}</td>
                                            <td>
                                                <span className={`badge ${user.Role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                                                    {user.Role ? user.Role.toUpperCase() : 'USER'}
                                                </span>
                                            </td>
                                            <td className="text-muted hide-mobile">{user.Created ? user.Created.split('T')[0].split('-').reverse().join('-') : '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button
                                                        className="btn-icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenSideCard(user);
                                                        }}
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-icon text-danger"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(user.UserID);
                                                        }}
                                                        disabled={user.Role === 'admin'}
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Side Card / Drawer */}
                {isSidebarOpen && (
                    <div className="side-card fade-in" style={{
                        width: '400px',
                        position: 'sticky',
                        top: '100px',
                        zIndex: 10
                    }}>
                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                                <button className="btn-icon" onClick={() => setIsSidebarOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <Input
                                    label="Full Name"
                                    placeholder="Enter user name"
                                    value={formData.UserName}
                                    onChange={e => setFormData({ ...formData, UserName: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={formData.EmailAddress}
                                    onChange={e => setFormData({ ...formData, EmailAddress: e.target.value })}
                                    required
                                />
                                {!editingUser && (
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.Password}
                                        onChange={e => setFormData({ ...formData, Password: e.target.value })}
                                        required
                                    />
                                )}
                                <Input
                                    label="Mobile Number"
                                    placeholder="+91 00000 00000"
                                    value={formData.MobileNo}
                                    onChange={e => setFormData({ ...formData, MobileNo: e.target.value })}
                                />

                                <div className="form-group">
                                    <label className="input-label">System Role</label>
                                    <select
                                        className="form-input"
                                        value={formData.Role}
                                        onChange={e => setFormData({ ...formData, Role: e.target.value })}
                                    >
                                        <option value="user">Standard User</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>

                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                                    <Button type="submit" variant="primary" style={{ flex: 1 }}>
                                        {editingUser ? 'Save Updates' : 'Create User'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsSidebarOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
