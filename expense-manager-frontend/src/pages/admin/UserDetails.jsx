import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Mail, Shield, DollarSign, Wallet, TrendingUp,
    Plus, Trash2, Edit2, X, User
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import api from '../../api/axios';
import Modal from '../../components/common/Modal';
import { useData } from '../../context/DataContext';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data State
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [peoples, setPeoples] = useState([]);

    // Side Card & Form State
    const [sideCardOpen, setSideCardOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'expense', 'income', 'category', 'project'
    const [editItem, setEditItem] = useState(null);

    // Form Data
    const [formData, setFormData] = useState({});

    // Specific state for Subcategories in Modal
    const [subcategoriesList, setSubcategoriesList] = useState([]);
    const [subInput, setSubInput] = useState('');

    // Quick Add States
    const { addItem, updateItem } = useData();
    const [modalOpen, setModalOpen] = useState({ category: false, subcategory: false, project: false, staff: false });
    const [quickAddItem, setQuickAddItem] = useState({ name: '', email: '', mobile: '', role: 'Employee', startDate: new Date().toISOString().split('T')[0] });

    // Fetch All Data for User
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch User Profile
            const userRes = await api.get(`/users/${id}`);
            const userData = userRes.data?.data || userRes.data;
            setUser(Array.isArray(userData) ? userData[0] : userData);

            // Fetch Related Data
            const [expRes, incRes, catRes, projRes, peoRes] = await Promise.all([
                api.get(`/expenses?userId=${id}`),
                api.get(`/incomes?userId=${id}`),
                api.get(`/categories?userId=${id}`),
                api.get(`/projects?userId=${id}`),
                api.get(`/peoples?userId=${id}`)
            ]);

            setExpenses(expRes.data?.data || []);
            setIncomes(incRes.data?.data || []);
            setCategories(catRes.data?.data || []);
            setProjects(projRes.data?.data || []);
            setPeoples(peoRes.data?.data || []);

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchAllData();
    }, [id, fetchAllData]);

    // Handlers
    const handleDelete = async (endpoint, itemId, type) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.delete(`/${endpoint}/${itemId}`);
                fetchAllData(); // Refresh
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item.");
            }
        }
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setEditItem(item);

        // Reset subcategory state
        setSubcategoriesList([]);
        setSubInput('');

        // Initialize Form Data
        if (type === 'expense' || type === 'income') {
            const itemDate = type === 'expense' ? item?.ExpenseDate : item?.IncomeDate;
            setFormData({
                ...item,
                Amount: item ? item.Amount : '',
                Date: itemDate ? new Date(itemDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                CategoryID: item ? item.CategoryID : '',
                SubCategoryID: item ? item.SubCategoryID : '',
                ProjectID: item ? item.ProjectID : '',
                PeopleID: item ? item.PeopleID : '',
                Remarks: item ? item.Description : '' // Map backend Description to frontend Remarks
            });
        } else if (type === 'category') {
            setFormData({
                ...item,
                CategoryName: item ? item.CategoryName : '',
                IsIncome: item ? item.IsIncome : 0,
                IsExpense: item ? item.IsExpense : 1
            });
            // Load existing subcategories if editing
            if (item && item.subcategories) {
                setSubcategoriesList(item.subcategories || []);
            }
        } else if (type === 'project') {
            setFormData({
                ...item,
                ProjectName: item ? item.ProjectName : '',
                ProjectStartDate: item?.ProjectStartDate ? new Date(item.ProjectStartDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                ProjectDetail: item ? item.ProjectDetail : 'Active'
            });
        } else if (type === 'staff') {
            setFormData({
                ...item,
                PeopleName: item ? item.PeopleName : '',
                PeopleCode: item ? item.PeopleCode : '',
                Email: item ? item.Email : '',
                MobileNo: item ? item.MobileNo : '',
                Description: item ? item.Description : '',
                Password: item ? item.Password : '123456' // Default password for new members
            });
        }

        setSideCardOpen(true);
    };

    const handleAddSubcategory = () => {
        if (subInput.trim()) {
            if (!subcategoriesList.some(sub => sub.SubCategoryName.toLowerCase() === subInput.trim().toLowerCase())) {
                setSubcategoriesList([...subcategoriesList, { SubCategoryName: subInput.trim() }]);
                setSubInput('');
            }
        }
    };

    const handleRemoveSubcategory = (index) => {
        const newSubs = [...subcategoriesList];
        newSubs.splice(index, 1);
        setSubcategoriesList(newSubs);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let endpoint = '';
            let payload = { ...formData, UserID: id }; // Enforce UserID

            if (modalType === 'expense') {
                endpoint = 'expenses';
                payload.ExpenseDate = formData.Date;
                payload.Description = formData.Remarks; // Map frontend Remarks back to backend Description
            } else if (modalType === 'income') {
                endpoint = 'incomes';
                payload.IncomeDate = formData.Date;
                payload.Description = formData.Remarks; // Map frontend Remarks back to backend Description
            } else if (modalType === 'category') {
                endpoint = 'categories';
                payload.IsActive = 1;
                payload.IsExpense = payload.IsIncome == '1' ? 0 : 1;
                // Add subcategories to payload
                payload.subcategories = subcategoriesList;
            } else if (modalType === 'project') {
                endpoint = 'projects';
                payload.IsActive = 1;
                payload.ProjectEndDate = payload.ProjectStartDate;
            } else if (modalType === 'staff') {
                endpoint = 'peoples';
                payload.IsActive = 1;
            }

            if (editItem) {
                const itemId = editItem[Object.keys(editItem).find(k => k.endsWith('ID'))];
                await api.patch(`/${endpoint}/${itemId}`, payload);
            } else {
                await api.post(`/${endpoint}`, payload);
            }

            setSideCardOpen(false);
            fetchAllData();
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Failed to save data. Please check inputs.");
        }
    };

    const handleQuickAdd = async (type) => {
        if (!quickAddItem.name) return;
        setLoading(true);
        let payload = {};
        let endpoint = '';

        if (type === 'category') {
            payload = {
                CategoryName: quickAddItem.name,
                IsExpense: modalType === 'income' ? 0 : 1,
                IsIncome: modalType === 'income' ? 1 : 0,
                Description: '',
                LogoPath: '',
                Sequence: 0,
                IsActive: 1,
                UserID: id,
                subcategories: [{ SubCategoryName: 'General' }]
            };
            endpoint = 'categories';
        } else if (type === 'subcategory') {
            const cat = categories.find(c => c.CategoryID === parseInt(formData.CategoryID));
            if (!cat) return;
            const updatedSubs = [...(cat.subcategories || []), { SubCategoryName: quickAddItem.name }];
            payload = {
                ...cat,
                subcategories: updatedSubs,
                LogoPath: cat.LogoPath || '',
                Description: cat.Description || '',
                Sequence: cat.Sequence || 0,
                IsActive: cat.IsActive ?? 1,
                UserID: id
            };
            endpoint = 'categories';
        } else if (type === 'project') {
            payload = {
                ProjectName: quickAddItem.name,
                ProjectStartDate: quickAddItem.startDate,
                ProjectEndDate: quickAddItem.startDate,
                ProjectDetail: 'Active',
                ProjectLogo: '',
                Description: 'Active',
                IsActive: 1,
                UserID: id
            };
            endpoint = 'projects';
        } else if (type === 'staff') {
            payload = {
                PeopleName: quickAddItem.name,
                Email: quickAddItem.email || `${quickAddItem.name.toLowerCase().replace(/\s/g, '')}@example.com`,
                MobileNo: quickAddItem.mobile || '0000000000',
                PeopleCode: quickAddItem.name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000),
                Password: 'password123',
                Description: quickAddItem.role,
                IsActive: 1,
                UserID: id
            };
            endpoint = 'peoples';
        }

        let success = false;
        if (type === 'subcategory') {
            success = await updateItem(endpoint, formData.CategoryID, payload);
        } else {
            success = await addItem(endpoint, payload);
        }

        setLoading(false);
        if (success) {
            setModalOpen({ category: false, subcategory: false, project: false, staff: false });
            setQuickAddItem({ name: '', email: '', mobile: '', role: 'Employee', startDate: new Date().toISOString().split('T')[0] });
            fetchAllData(); // Refresh the local data for this user
        }
    };

    // Analytics Calculations
    const monthlyData = useMemo(() => {
        const months = {};
        const getMonthYear = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        };

        expenses.forEach(item => {
            const key = getMonthYear(item.ExpenseDate);
            if (!months[key]) months[key] = { name: key, income: 0, expense: 0 };
            months[key].expense += Number(item.Amount || 0);
        });

        incomes.forEach(item => {
            const key = getMonthYear(item.IncomeDate);
            if (!months[key]) months[key] = { name: key, income: 0, expense: 0 };
            months[key].income += Number(item.Amount || 0);
        });

        return Object.values(months).sort((a, b) => new Date(Date.parse(`01 ${a.name}`)) - new Date(Date.parse(`01 ${b.name}`)));
    }, [expenses, incomes]);

    const categoryData = useMemo(() => {
        const cats = {};
        expenses.forEach(item => {
            const catName = categories.find(c => c.CategoryID === item.CategoryID)?.CategoryName || 'Unknown';
            if (!cats[catName]) cats[catName] = { name: catName, value: 0 };
            cats[catName].value += Number(item.Amount || 0);
        });
        return Object.values(cats).sort((a, b) => b.value - a.value);
    }, [expenses, categories]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Render Helpers
    if (loading && !user) return <div className="p-8 text-center">Loading...</div>;
    if (!user) return <div className="p-8 text-center">User not found</div>;

    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.Amount || 0), 0);
    const totalIncome = incomes.reduce((sum, item) => sum + Number(item.Amount || 0), 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="dashboard-container">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="btn btn-ghost"
                    style={{ color: 'var(--text-muted)', padding: '0.5rem' }}
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">{user.UserName}</h1>
                    <div className="flex gap-4 text-base text-muted mt-1">
                        <span className="flex items-center gap-1"><b>Email: {user.EmailAddress}</b> </span><br />
                        <span className="flex items-center gap-1"><b>Role: {user.Role}</b></span><br />
                        {user.MobileNo && <span className="flex items-center gap-1"><b>Phone: {user.MobileNo}</b></span>}<br />
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid-form" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="stat-card gradient-indigo py-5">
                    <div className="stat-card-content">
                        <div><p className="text-sm opacity-80">Total Balance</p><h3>₹{balance.toLocaleString()}</h3></div>
                        <Wallet size={24} color="white" />
                    </div>
                </div>
                <div className="stat-card gradient-emerald py-5">
                    <div className="stat-card-content">
                        <div><p className="text-sm opacity-80">Total Income</p><h3>₹{totalIncome.toLocaleString()}</h3></div>
                        <DollarSign size={24} color="white" />
                    </div>
                </div>
                <div className="stat-card gradient-rose py-5">
                    <div className="stat-card-content">
                        <div><p className="text-sm opacity-80">Total Expense</p><h3>₹{totalExpense.toLocaleString()}</h3></div>
                        <TrendingUp size={24} color="white" />
                    </div>
                </div>
            </div>

            {/* 2-Column Layout for Side Card */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Stacked Tables */}
                    <div className="space-y-8 fade-in">
                        {/* Expenses */}
                        <div style={{ marginBottom: '2rem' }}>
                            <Card title="User Expenses">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => openModal('expense')} variant="primary" className="flex items-center gap-2">
                                        <Plus size={16} /> Add Expense
                                    </Button>
                                </div>
                                <Table headers={['Date', 'Amount', 'Category', 'Project', 'Remarks', 'Actions']}>
                                    {expenses.length > 0 ? expenses.map(item => (
                                        <tr key={item.ExpenseID} className={editItem?.ExpenseID === item.ExpenseID ? 'active-row' : ''}>
                                            <td>{item.ExpenseDate ? item.ExpenseDate.split('T')[0].split('-').reverse().join('-') : '-'}</td>
                                            <td>₹{Number(item.Amount).toLocaleString()}</td>
                                            <td>{categories.find(c => c.CategoryID === item.CategoryID)?.CategoryName || 'Unknown'}</td>
                                            <td>{projects.find(p => p.ProjectID === item.ProjectID)?.ProjectName || '-'}</td>
                                            <td>{item.Description || '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button onClick={() => openModal('expense', item)} className="text-info"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete('expenses', item.ExpenseID)} className="text-danger"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="text-center text-muted">No expenses found</td></tr>
                                    )}
                                </Table>
                            </Card>
                        </div>

                        {/* Incomes */}
                        <div style={{ marginBottom: '2rem' }}>
                            <Card title="User Incomes">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => openModal('income')} variant="primary" className="flex items-center gap-2">
                                        <Plus size={16} /> Add Income
                                    </Button>
                                </div>
                                <Table headers={['Date', 'Amount', 'Category', 'Project', 'Remarks', 'Actions']}>
                                    {incomes.length > 0 ? incomes.map(item => (
                                        <tr key={item.IncomeID} className={editItem?.IncomeID === item.IncomeID ? 'active-row' : ''}>
                                            <td>{item.IncomeDate ? item.IncomeDate.split('T')[0].split('-').reverse().join('-') : '-'}</td>
                                            <td>₹{Number(item.Amount).toLocaleString()}</td>
                                            <td>{categories.find(c => c.CategoryID === item.CategoryID)?.CategoryName || 'Unknown'}</td>
                                            <td>{projects.find(p => p.ProjectID === item.ProjectID)?.ProjectName || '-'}</td>
                                            <td>{item.Description || '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button onClick={() => openModal('income', item)} className="text-info"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete('incomes', item.IncomeID)} className="text-danger"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="text-center text-muted">No incomes found</td></tr>
                                    )}
                                </Table>
                            </Card>
                        </div>

                        {/* Staff Details */}
                        <div style={{ marginBottom: '2rem' }}>
                            <Card title="User Staff">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => openModal('staff')} variant="primary" className="flex items-center gap-2">
                                        <Plus size={16} /> Add Staff
                                    </Button>
                                </div>
                                <Table headers={['Name', 'Email', 'Mobile', 'Actions']}>
                                    {peoples.length > 0 ? peoples.map(item => (
                                        <tr key={item.PeopleID} className={editItem?.PeopleID === item.PeopleID ? 'active-row' : ''}>
                                            <td>
                                                <div className="flex items-center gap-2">

                                                    <span style={{ fontWeight: 500 }}>{item.PeopleName}</span>
                                                </div>
                                            </td>
                                            <td>{item.Email}</td>
                                            <td>{item.MobileNo}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button onClick={() => openModal('staff', item)} className="text-info"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete('peoples', item.PeopleID)} className="text-danger"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="text-center text-muted">No staff members found</td></tr>
                                    )}
                                </Table>
                            </Card>
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: '2rem' }}>
                            <Card title="User Categories">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => openModal('category')} variant="primary" className="flex items-center gap-2">
                                        <Plus size={16} /> Add Category
                                    </Button>
                                </div>
                                <Table headers={['Name', 'Type', 'Subcategories', 'Actions']}>
                                    {categories.map(item => (
                                        <tr key={item.CategoryID} className={editItem?.CategoryID === item.CategoryID ? 'active-row' : ''}>
                                            <td>{item.CategoryName}</td>
                                            <td><span className={`badge ${item.IsIncome ? 'badge-success' : 'badge-danger'}`}>{item.IsIncome ? 'Income' : 'Expense'}</span></td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.subcategories && item.subcategories.map((sub, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded border border-gray-200 dark:border-white/10">
                                                            {sub.SubCategoryName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button onClick={() => openModal('category', item)} className="text-info"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete('categories', item.CategoryID)} className="text-danger"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                            </Card>
                        </div>

                        {/* Projects */}
                        <div style={{ marginBottom: '2rem' }}>
                            <Card title="User Projects">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => openModal('project')} variant="primary" className="flex items-center gap-2">
                                        <Plus size={16} /> Add Project
                                    </Button>
                                </div>
                                <Table headers={['Name', 'Start Date', 'Status', 'Actions']}>
                                    {projects.map(item => (
                                        <tr key={item.ProjectID} className={editItem?.ProjectID === item.ProjectID ? 'active-row' : ''}>
                                            <td>{item.ProjectName}</td>
                                            <td>{item.ProjectStartDate ? item.ProjectStartDate.split('T')[0].split('-').reverse().join('-') : '-'}</td>
                                            <td><span className="badge badge-neutral">{item.ProjectDetail}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button onClick={() => openModal('project', item)} className="text-info"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete('projects', item.ProjectID)} className="text-danger"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Side Card Form */}
                {sideCardOpen && (
                    <div className="side-card slide-in-right" style={{ width: '400px', position: 'sticky', top: '100px' }}>
                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>
                                    {editItem ? 'Edit' : 'Add'} {modalType === 'category' ? 'Category' : modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                                </h3>
                                <button className="btn-icon" onClick={() => setSideCardOpen(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {(modalType === 'expense' || modalType === 'income') && (
                                        <>
                                            <Input label="Amount" type="number" value={formData.Amount} onChange={e => setFormData({ ...formData, Amount: e.target.value })} required />
                                            <Input label="Date" type="date" value={formData.Date} onChange={e => setFormData({ ...formData, Date: e.target.value })} required />
                                            <div className="form-row-with-add">
                                                <div className="form-group main-input">
                                                    <label className="input-label">Category</label>
                                                    <select className="form-input" value={formData.CategoryID} onChange={e => setFormData({ ...formData, CategoryID: e.target.value, SubCategoryID: '' })} required>
                                                        <option value="">Select Category</option>
                                                        {categories.filter(c => modalType === 'income' ? c.IsIncome : !c.IsIncome).map(c => (
                                                            <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group add-button">
                                                    <button type="button" className="btn-add-new" onClick={() => setModalOpen({ ...modalOpen, category: true })}>
                                                        <Plus size={14} /> Add New
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-row-with-add">
                                                <div className="form-group main-input">
                                                    <label className="input-label">Project</label>
                                                    <select className="form-input" value={formData.ProjectID} onChange={e => setFormData({ ...formData, ProjectID: e.target.value })}>
                                                        <option value="">Select Project</option>
                                                        {projects.map(p => (
                                                            <option key={p.ProjectID} value={p.ProjectID}>{p.ProjectName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group add-button">
                                                    <button type="button" className="btn-add-new" onClick={() => setModalOpen({ ...modalOpen, project: true })}>
                                                        <Plus size={14} /> Add New
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-row-with-add">
                                                <div className="form-group main-input">
                                                    <label className="input-label">Sub Category</label>
                                                    <select
                                                        className="form-input" required
                                                        value={formData.SubCategoryID}
                                                        onChange={e => setFormData({ ...formData, SubCategoryID: e.target.value })}
                                                        disabled={!formData.CategoryID}
                                                    >
                                                        <option value="">Select Subcategory</option>
                                                        {categories.find(c => c.CategoryID === parseInt(formData.CategoryID))?.subcategories?.map(sub => (
                                                            <option key={sub.SubCategoryID} value={sub.SubCategoryID}>{sub.SubCategoryName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group add-button">
                                                    <button
                                                        type="button"
                                                        className="btn-add-new"
                                                        disabled={!formData.CategoryID}
                                                        onClick={() => setModalOpen({ ...modalOpen, subcategory: true })}
                                                    >
                                                        <Plus size={14} /> Add New
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-row-with-add">
                                                <div className="form-group main-input">
                                                    <label className="input-label">Person / Staff</label>
                                                    <select
                                                        className="form-input" required
                                                        value={formData.PeopleID}
                                                        onChange={e => setFormData({ ...formData, PeopleID: e.target.value })}
                                                    >
                                                        <option value="">Assigned To</option>
                                                        {peoples.map(p => (
                                                            <option key={p.PeopleID} value={p.PeopleID}>{p.PeopleName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group add-button">
                                                    <button
                                                        type="button"
                                                        className="btn-add-new"
                                                        onClick={() => setModalOpen({ ...modalOpen, staff: true })}
                                                    >
                                                        <Plus size={14} /> Add New
                                                    </button>
                                                </div>
                                            </div>
                                            <Input label="Remarks" value={formData.Remarks} onChange={e => setFormData({ ...formData, Remarks: e.target.value })} />
                                        </>
                                    )}

                                    {modalType === 'category' && (
                                        <>
                                            <Input label="Category Name" value={formData.CategoryName} onChange={e => setFormData({ ...formData, CategoryName: e.target.value })} required />
                                            <div className="form-group">
                                                <label className="input-label">Type</label>
                                                <select className="form-input" value={formData.IsIncome == 1 ? '1' : '0'} onChange={e => setFormData({ ...formData, IsIncome: e.target.value, IsExpense: e.target.value == '1' ? '0' : '1' })}>
                                                    <option value="0">Expense</option>
                                                    <option value="1">Income</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="input-label">Subcategories</label>
                                                <div className="flex gap-2 mb-2">
                                                    <Input placeholder="Add subcategory" value={subInput} onChange={e => setSubInput(e.target.value)} className="flex-1" />
                                                    <Button type="button" onClick={handleAddSubcategory} variant="outline" className="p-2 aspect-square flex items-center justify-center"><Plus size={16} /></Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {subcategoriesList.map((sub, index) => (
                                                        <span key={index} className="badge badge-neutral flex items-center gap-1">
                                                            {sub.SubCategoryName}
                                                            <button type="button" onClick={() => handleRemoveSubcategory(index)}><X size={12} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {modalType === 'project' && (
                                        <>
                                            <Input label="Project Name" value={formData.ProjectName} onChange={e => setFormData({ ...formData, ProjectName: e.target.value })} required />
                                            <Input label="Start Date" type="date" value={formData.ProjectStartDate} onChange={e => setFormData({ ...formData, ProjectStartDate: e.target.value })} required />
                                            <div className="form-group">
                                                <label className="input-label">Status</label>
                                                <select className="form-input" value={formData.ProjectDetail} onChange={e => setFormData({ ...formData, ProjectDetail: e.target.value })}>
                                                    <option>Active</option>
                                                    <option>Completed</option>
                                                    <option>Planning</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {modalType === 'staff' && (
                                        <>
                                            <Input label="Full Name" value={formData.PeopleName} onChange={e => setFormData({ ...formData, PeopleName: e.target.value })} required />
                                            <Input label="Staff Code" value={formData.PeopleCode} onChange={e => setFormData({ ...formData, PeopleCode: e.target.value })} required />
                                            <Input label="Email Address" type="email" value={formData.Email} onChange={e => setFormData({ ...formData, Email: e.target.value })} required />
                                            <Input label="Mobile Number" value={formData.MobileNo} onChange={e => setFormData({ ...formData, MobileNo: e.target.value })} />
                                            <Input label="Job Description" value={formData.Description} onChange={e => setFormData({ ...formData, Description: e.target.value })} />
                                            {!editItem && (
                                                <Input label="Access Password" type="password" value={formData.Password} onChange={e => setFormData({ ...formData, Password: e.target.value })} required />
                                            )}
                                        </>
                                    )}
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
                                    <Button type="submit" variant="primary" style={{ flex: 1 }}>Save Changes</Button>
                                    <Button type="button" variant="outline" onClick={() => setSideCardOpen(false)}>Cancel</Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>

            {/* Quick Add Modals */}
            <Modal
                isOpen={modalOpen.category}
                onClose={() => setModalOpen({ ...modalOpen, category: false })}
                title="Add New Category"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Category Name" value={quickAddItem.name} onChange={e => setQuickAddItem({ ...quickAddItem, name: e.target.value })} autoFocus />
                    <Button onClick={() => handleQuickAdd('category')} disabled={loading}>Save Category</Button>
                </div>
            </Modal>

            <Modal
                isOpen={modalOpen.subcategory}
                onClose={() => setModalOpen({ ...modalOpen, subcategory: false })}
                title="Add New Subcategory"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Adding to: {categories.find(c => c.CategoryID === parseInt(formData.CategoryID))?.CategoryName || 'Unknown'}
                    </p>
                    <Input label="Subcategory Name" value={quickAddItem.name} onChange={e => setQuickAddItem({ ...quickAddItem, name: e.target.value })} autoFocus />
                    <Button onClick={() => handleQuickAdd('subcategory')} disabled={loading}>Save Subcategory</Button>
                </div>
            </Modal>

            <Modal
                isOpen={modalOpen.project}
                onClose={() => setModalOpen({ ...modalOpen, project: false })}
                title="Add New Project"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Project Name" value={quickAddItem.name} onChange={e => setQuickAddItem({ ...quickAddItem, name: e.target.value })} autoFocus />
                    <Input label="Start Date" type="date" value={quickAddItem.startDate} onChange={e => setQuickAddItem({ ...quickAddItem, startDate: e.target.value })} />
                    <Button onClick={() => handleQuickAdd('project')} disabled={loading}>Save Project</Button>
                </div>
            </Modal>

            <Modal
                isOpen={modalOpen.staff}
                onClose={() => setModalOpen({ ...modalOpen, staff: false })}
                title="Add New Person / Staff"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Full Name" value={quickAddItem.name} onChange={e => setQuickAddItem({ ...quickAddItem, name: e.target.value })} autoFocus />
                    <Input label="Email" type="email" value={quickAddItem.email} onChange={e => setQuickAddItem({ ...quickAddItem, email: e.target.value })} />
                    <Input label="Mobile" value={quickAddItem.mobile} onChange={e => setQuickAddItem({ ...quickAddItem, mobile: e.target.value })} />
                    <div className="form-group">
                        <label className="input-label">Role</label>
                        <select className="form-input" value={quickAddItem.role} onChange={e => setQuickAddItem({ ...quickAddItem, role: e.target.value })}>
                            <option>Employee</option>
                            <option>Manager</option>
                            <option>Admin</option>
                        </select>
                    </div>
                    <Button onClick={() => handleQuickAdd('staff')} disabled={loading}>Save Staff</Button>
                </div>
            </Modal>

            {/* Analytics Section stays at the bottom */}
            <div style={{ marginTop: '3rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Card title="Monthly Overview">
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }} />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <Card title="Expense Distribution">
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Removed Modal Overlay */}
        </div>
    );
};

export default UserDetails;
