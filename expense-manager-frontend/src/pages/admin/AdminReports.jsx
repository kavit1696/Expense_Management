import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import { User, Mail, Shield, Phone } from 'lucide-react';

const AdminReports = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/users');
            // Filter only admins for this report
            const adminList = (res.data?.data || []).filter(user => user.Role === 'admin');
            setAdmins(adminList);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    if (loading) return (
        <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div className="text-muted">Loading Admin Reports...</div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Admin Reports</h1>
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '1.5rem' }}>
                {admins.length > 0 ? (
                    admins.map(admin => (
                        <Card
                            key={admin.UserID}
                            className="admin-report-card"
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onClick={() => navigate(`/admin/userdetails/${admin.UserID}`)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: '12px',
                                        background: 'var(--primary-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem'
                                    }}>
                                        {admin.UserName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{admin.UserName}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Shield size={12} color="var(--primary)" />
                                            <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>ADMINISTRATOR</span>
                                        </div>
                                    </div>
                                </div>

                                <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1rem' }}>
                                        <User size={25} />
                                        <span>{admin.UserName}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1rem' }}>
                                        <Phone size={25} />
                                        <span>{admin.MobileNo || 'No Phone Number'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1rem' }}>
                                        <Mail size={25} />
                                        <span>{admin.EmailAddress}</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '0.5rem' }}>
                                    <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem' }}>View Full Activity</button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        <Shield size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                        <h3 className="text-muted">No additional administrators found.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
