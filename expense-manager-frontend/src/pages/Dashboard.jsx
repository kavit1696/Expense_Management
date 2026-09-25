import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import { ArrowUp, ArrowDown, DollarSign, Wallet, Activity, Briefcase, IndianRupee } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const { data } = useData();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    // Helpers to lookup names
    const getCategoryName = (id) => data?.categories?.find(c => c.CategoryID === id)?.CategoryName || 'Unknown';
    const getProjectName = (id) => data?.projects?.find(p => p.ProjectID === id)?.ProjectName || 'Unknown';
    const getSubCategoryName = (catId, subId) => {
        const cat = data?.categories?.find(c => c.CategoryID === catId);
        const sub = cat?.subcategories?.find(s => s.SubCategoryID === subId);
        return sub?.SubCategoryName || '';
    };

    // Normalize Data
    const expenses = (data?.expenses || []).map(item => ({
        ...item,
        amount: Number(item.Amount || 0),
        date: item.ExpenseDate,
        category: getCategoryName(item.CategoryID),
        subcategory: getSubCategoryName(item.CategoryID, item.SubCategoryID),
        project: getProjectName(item.ProjectID)
    }));

    const incomes = (data?.incomes || []).map(item => ({
        ...item,
        amount: Number(item.Amount || 0),
        date: item.IncomeDate,
        category: getCategoryName(item.CategoryID),
        subcategory: getSubCategoryName(item.CategoryID, item.SubCategoryID),
        project: getProjectName(item.ProjectID)
    }));

    const projects = (data?.projects || []).map(item => ({
        ...item,
        status: item.ProjectDetail // Mapping Query result to expected status
    }));

    // Calculate Aggregates
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;

    // Recent Transactions
    const recentTransactions = [
        ...expenses.map(e => ({ ...e, type: 'expense' })),
        ...incomes.map(i => ({ ...i, type: 'income' }))
    ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);

    const StatCard = ({ title, amount, icon: Icon, gradientClass, trend, prefix = '₹' }) => (
        <div className={`stat-card ${gradientClass}`}>
            <div className="stat-card-content">
                <div className="stat-value">
                    <p className="text-sm opacity-80">{title}</p>
                    <h3>{prefix}{amount.toLocaleString()}</h3>
                </div>
                <div className="stat-icon">
                    <Icon size={24} color="white" />
                </div>
            </div>
            <div className="stat-glow"></div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <h1>Dashboard</h1>
                    <p className="text-muted">Welcome back, <strong>{user?.name}</strong> 👋</p>
                </div>
                <div className="dashboard-actions" style={{ position: 'relative', display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => window.print()}>Export Report</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        + Add New
                    </button>

                    {showDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.5rem',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'saturate(180%) blur(20px)',
                            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-md)',
                            borderRadius: 'var(--radius-md)',
                            zIndex: 50,
                            minWidth: '150px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => navigate('/dashboard/expenses')}
                                style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: 'left',
                                    borderBottom: '1px solid var(--border-color)',
                                    color: 'var(--text-main)'
                                }}
                                className="hover:bg-gray-100"
                            >
                                Add Expense
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/incomes')}
                                style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: 'left',
                                    borderBottom: '1px solid var(--border-color)',
                                    color: 'var(--text-main)'
                                }}
                            >
                                Add Income
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/projects')}
                                style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: 'left',
                                    color: 'var(--text-main)'
                                }}
                            >
                                Add Project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Income"
                    amount={totalIncome}
                    icon={IndianRupee}
                    gradientClass="gradient-emerald"
                    trend="up"
                />
                <StatCard
                    title="Total Expense"
                    amount={totalExpense}
                    icon={Wallet}
                    gradientClass="gradient-rose"
                    trend="down"
                />
                <StatCard
                    title="Total Balance"
                    amount={balance}
                    icon={Activity}
                    gradientClass="gradient-indigo"
                    trend={balance >= 0 ? 'up' : 'down'}
                />
                <StatCard
                    title="Active Projects"
                    amount={projects.filter(p => p.status === 'Active').length}
                    icon={Briefcase}
                    gradientClass="gradient-amber"
                    trend="up"
                    prefix=""
                />
            </div>

            <div className="dashboard-main-grid">
                {/* Main Chart Area */}
                <Card title="Analytics Overview">
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={expenses.reduce((acc, curr) => {
                                    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
                                    const existing = acc.find(item => item.name === month);
                                    if (existing) {
                                        existing.expense += curr.amount;
                                    } else {
                                        acc.push({ name: month, expense: curr.amount, income: 0 });
                                    }
                                    return acc;
                                }, incomes.reduce((acc, curr) => {
                                    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
                                    const existing = acc.find(item => item.name === month);
                                    if (existing) {
                                        existing.income += curr.amount;
                                    } else {
                                        acc.push({ name: month, income: curr.amount, expense: 0 });
                                    }
                                    return acc;
                                }, [])).sort((a, b) => {
                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                    return months.indexOf(a.name) - months.indexOf(b.name);
                                })}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        borderColor: 'var(--border-color)',
                                        borderRadius: '12px',
                                        backdropFilter: 'saturate(180%) blur(20px)',
                                        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Categories Breakdown */}
                <Card title="Expenses by Category">
                    <div style={{ height: '250px', width: '100%', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(expenses.reduce((acc, item) => {
                                        const catName = item.category || 'Uncategorized';
                                        acc[catName] = (acc[catName] || 0) + Number(item.amount);
                                        return acc;
                                    }, {})).map(([name, value]) => ({ name, value }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {Object.keys(expenses.reduce((acc, item) => {
                                        const catName = item.category || 'Uncategorized';
                                        acc[catName] = (acc[catName] || 0) + Number(item.amount);
                                        return acc;
                                    }, {})).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#64d2ff'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        borderColor: 'var(--border-color)',
                                        borderRadius: '12px',
                                        backdropFilter: 'saturate(180%) blur(20px)',
                                        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}>
                            <strong style={{ fontSize: '1.1rem', display: 'block' }}>₹{totalExpense.toLocaleString()}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Spent</span>
                        </div>
                    </div>
                    <div className="category-legend" style={{ marginTop: '1rem' }}>
                        {(() => {
                            const categoryTotals = expenses.reduce((acc, item) => {
                                const catName = item.category || 'Uncategorized';
                                acc[catName] = (acc[catName] || 0) + Number(item.amount);
                                return acc;
                            }, {});

                            const topCategories = Object.entries(categoryTotals)
                                .map(([name, amount]) => ({ name, amount }))
                                .sort((a, b) => b.amount - a.amount)
                                .slice(0, 4);

                            if (topCategories.length === 0) {
                                return <p className="text-center text-muted">No data</p>;
                            }

                            return topCategories.map((cat, i) => (
                                <div key={cat.name} className="legend-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <span style={{
                                            width: 10, height: 10, borderRadius: '50%',
                                            background: ['#6366f1', '#f43f5e', '#f59e0b', '#10b981'][i % 4]
                                        }}></span>
                                        {cat.name}
                                    </span>
                                    <strong style={{ fontSize: '0.85rem' }}>₹{cat.amount.toLocaleString()}</strong>
                                </div>
                            ));
                        })()}
                    </div>
                </Card>
            </div>

            {/* Recent Transactions Section */}
            <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Transactions</h2>
                    <button className="btn-text" style={{ fontSize: '0.85rem', color: 'var(--primary)' }} onClick={() => navigate('/dashboard/expenses')}>
                        View All
                    </button>
                </div>
            </div>
            <Card>
                <div className="table-responsive">
                    <table className="table trans-table">
                        <thead>
                            <tr>
                                <th>Transaction</th>
                                <th>Date</th>
                                <th>Project</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(item => (
                                <tr key={`${item.type}-${item.id}`}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className={`trans-icon ${item.type === 'income' ? 'trans-income' : 'trans-expense'}`}>
                                                {item.type === 'income' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{item.category}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.subcategory}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.date ? item.date.split('T')[0].split('-').reverse().join('-') : '-'}</td>
                                    <td><span className="badge badge-neutral">{item.project}</span></td>
                                    <td style={{ fontWeight: 'bold', color: item.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                                        {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <span className="badge badge-success">Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
