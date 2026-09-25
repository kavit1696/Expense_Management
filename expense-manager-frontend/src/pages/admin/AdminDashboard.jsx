import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import { Users, DollarSign, Wallet, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalExpenses: 0,
        totalIncome: 0,
        balance: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch all data (no userId param means all data for admin)
                const [usersRes, expensesRes, incomesRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/expenses'),
                    api.get('/incomes')
                ]);

                const expenses = (expensesRes.data?.data || []).filter(item => item.UserID !== user.UserID);
                const incomes = (incomesRes.data?.data || []).filter(item => item.UserID !== user.UserID);
                const users = (usersRes.data?.data || []).filter(u => u.Role !== 'admin'); // Exclude admins from user count if desired, or keep as is. User requested "in all card", so excluding admin from user count might be what they want too.

                const totalExp = expenses.reduce((sum, item) => sum + Number(item.Amount || 0), 0);
                const totalInc = incomes.reduce((sum, item) => sum + Number(item.Amount || 0), 0);

                setStats({
                    totalUsers: users.length,
                    totalExpenses: totalExp,
                    totalIncome: totalInc,
                    balance: totalInc - totalExp
                });
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className={`stat-card ${colorClass}`}>
            <div className="stat-card-content">
                <div className="stat-value">
                    <p className="text-sm opacity-80">{title}</p>
                    <h3>{value}</h3>
                </div>
                <div className="stat-icon">
                    <Icon size={24} color="white" />
                </div>
            </div>
            <div className="stat-glow"></div>
        </div>
    );

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <h1>Dashboard</h1>
                    <p className="text-muted">Overview of all users activity</p>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    colorClass="gradient-indigo"
                />
                <StatCard
                    title="Total System Income"
                    value={`₹${stats.totalIncome.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="gradient-emerald"
                />
                <StatCard
                    title="Total System Expenses"
                    value={`₹${stats.totalExpenses.toLocaleString()}`}
                    icon={Wallet}
                    colorClass="gradient-rose"
                />
                <StatCard
                    title="Net System Balance"
                    value={`₹${stats.balance.toLocaleString()}`}
                    icon={Activity}
                    colorClass="gradient-amber"
                />
            </div>

            <div className="dashboard-content" style={{ marginTop: '2rem' }}>
                <Card title="Quick Actions">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/admin/users')}>
                            Manage Users
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate('/admin/reports')}>
                            System Reports
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
