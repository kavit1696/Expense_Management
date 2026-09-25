import React, { useMemo } from 'react';
import Card from '../components/common/Card';
import { useData } from '../context/DataContext';
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

const Reports = () => {
    const { data } = useData();

    // Calculate Monthly Data for Bar Chart
    const monthlyData = useMemo(() => {
        const months = {};

        // Helper to get Month-Year key
        const getMonthYear = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        };

        // Process Expenses
        (data?.expenses || []).forEach(item => {
            const key = getMonthYear(item.ExpenseDate);
            if (!months[key]) months[key] = { name: key, income: 0, expense: 0 };
            months[key].expense += Number(item.Amount || 0);
        });

        // Process Incomes
        (data?.incomes || []).forEach(item => {
            const key = getMonthYear(item.IncomeDate);
            if (!months[key]) months[key] = { name: key, income: 0, expense: 0 };
            months[key].income += Number(item.Amount || 0);
        });

        // Convert to array and sort by date (simplified sort)
        return Object.values(months).sort((a, b) => {
            // Simple hack to sort by month year string if needed, 
            // but better to rely on insertion order or implement comprehensive date parsing
            return new Date(Date.parse(`01 ${a.name}`)) - new Date(Date.parse(`01 ${b.name}`));
        });
    }, [data]);

    // Calculate Category Data for Pie Chart
    const categoryData = useMemo(() => {
        const categories = {};

        (data?.expenses || []).forEach(item => {
            const catName = data?.categories?.find(c => c.CategoryID === item.CategoryID)?.CategoryName || 'Unknown';
            if (!categories[catName]) categories[catName] = { name: catName, value: 0 };
            categories[catName].value += Number(item.Amount || 0);
        });

        return Object.values(categories).sort((a, b) => b.value - a.value);
    }, [data]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1>Reports & Analytics</h1>
                <p style={{ color: 'var(--text-muted)' }}>In-depth analysis of your financial data</p>
            </div>

            <div className="grid-form">
                <Card title="Monthly Overview (Income vs Expense)">
                    <div style={{ height: '350px', width: '100%' }}>
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        cursor={false}
                                        contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted">Cost data not available</div>
                        )}
                    </div>
                </Card>

                <Card title="Expense Distribution by Category">
                    <div style={{ height: '350px', width: '100%' }}>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted">Expense data not available</div>
                        )}
                    </div>
                </Card>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>Print / Download PDF</button>
            </div>
        </div>
    );
};

export default Reports;
