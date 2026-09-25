import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';

import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import { Trash2, Edit2, FileText, Plus } from 'lucide-react';

const Expenses = () => {
    const { data, addItem, updateItem, deleteItem } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Quick Add States
    const [modalOpen, setModalOpen] = useState({ category: false, subcategory: false, project: false, staff: false });
    const [quickAddItem, setQuickAddItem] = useState({ name: '', email: '', mobile: '', role: 'Employee', startDate: new Date().toISOString().split('T')[0] });


    const initialState = {
        date: new Date().toISOString().split('T')[0],
        category: '',
        subcategory: '',
        project: '',
        people: '',
        amount: '',
        attachment: '',
        remarks: ''
    };

    const [form, setForm] = useState(initialState);

    const expenseCategories = (data?.categories || []).filter(c => c && c.IsExpense == 1);
    const selectedCategory = expenseCategories.find(c => c.CategoryID === parseInt(form.category));
    const subcategories = (selectedCategory?.subcategories || []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...form,
            ExpenseDate: form.date,
            CategoryID: form.category,
            SubCategoryID: form.subcategory || null,
            ProjectID: form.project || null,
            PeopleID: form.people || null,
            Amount: parseFloat(form.amount),
            Description: form.remarks,
            AttachmentPath: form.attachment
        };

        let success = false;
        if (isEditing) {
            success = await updateItem('expenses', form.id, payload);
        } else {
            success = await addItem('expenses', payload);
        }
        setLoading(false);
        if (success) {
            resetForm();
        }
    };

    const resetForm = () => {
        setForm(initialState);
        setIsEditing(false);
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setForm({
            ...item,
            id: item.ExpenseID,
            date: item.ExpenseDate ? new Date(item.ExpenseDate).toISOString().split('T')[0] : '',
            category: item.CategoryID,
            subcategory: item.SubCategoryID,
            project: item.ProjectID,
            people: item.PeopleID,
            amount: item.Amount,
            attachment: item.AttachmentPath,
            remarks: item.Description
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const getCategoryName = (id) => data?.categories?.find(c => c.CategoryID === id)?.CategoryName || 'Unknown';
    const getSubCategoryName = (catId, subId) => {
        const cat = data?.categories?.find(c => c.CategoryID === catId);
        if (!cat) return '';
        const sub = cat.subcategories?.find(s => s.SubCategoryID === subId);
        return sub?.SubCategoryName || '';
    };
    const getProjectName = (id) => data?.projects?.find(p => p.ProjectID === id)?.ProjectName || '';
    const getPeopleName = (id) => data?.people?.find(p => p.PeopleID === id)?.PeopleName || '';

    const handleQuickAdd = async (type) => {
        if (!quickAddItem.name) return;
        setLoading(true);
        let payload = {};
        let endpoint = '';

        if (type === 'category') {
            payload = { 
                CategoryName: quickAddItem.name, 
                IsExpense: 1, 
                IsIncome: 0, 
                Description: '',
                LogoPath: '',
                Sequence: 0,
                IsActive: 1,
                subcategories: [{ SubCategoryName: 'General' }] 
            };
            endpoint = 'categories';
        } else if (type === 'subcategory') {
            const cat = data?.categories?.find(c => c.CategoryID === parseInt(form.category));
            if (!cat) return;
            const updatedSubs = [...(cat.subcategories || []), { SubCategoryName: quickAddItem.name }];
            payload = { 
                ...cat, 
                subcategories: updatedSubs,
                LogoPath: cat.LogoPath || '',
                Description: cat.Description || '',
                Sequence: cat.Sequence || 0,
                IsActive: cat.IsActive ?? 1
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
                IsActive: 1
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
                IsActive: 1
            };
            endpoint = 'people';
        }

        let success = false;
        if (type === 'subcategory') {
            success = await updateItem(endpoint, form.category, payload);
        } else {
            success = await addItem(endpoint, payload);
        }

        setLoading(false);
        if (success) {
            setModalOpen({ category: false, subcategory: false, project: false, staff: false });
            setQuickAddItem({ name: '', email: '', mobile: '', role: 'Employee', startDate: new Date().toISOString().split('T')[0] });
        }
    };


    return (
        <div className="dashboard-container">
            {/* Page Header */}
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div className="dashboard-title">
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Expense Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track and manage your project expenditures</p>
                </div>
                <div className="dashboard-actions">
                    <button
                        className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            } else {
                                setForm(initialState);
                                setIsEditing(false);
                                setShowForm(true);
                            }
                        }}
                    >
                        {showForm ? 'Close Form' : <><Plus size={18} style={{ marginRight: '8px' }} /> Add Expense</>}
                    </button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Monthly Expense</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>₹{(data?.expenses || []).reduce((sum, e) => sum + Number(e.Amount || 0), 0).toLocaleString()}</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Transactions</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{(data?.expenses || []).length}</h3>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showForm ? '380px 1fr' : '1fr', gap: '2rem', transition: 'all 0.4s ease' }}>

                {/* Side-by-side Form */}
                {showForm && (
                    <div className="fade-in" style={{ position: 'sticky', top: '2rem', alignSelf: 'start' }}>
                        <Card title={isEditing ? "Edit Details" : "New Transaction"}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <Input
                                        label="Transaction Date" type={form.dateFocus ? "date" : "text"} required
                                        value={form.dateFocus ? form.date : (form.date ? form.date.split('T')[0].split('-').reverse().join('-') : '')}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        onFocus={() => setForm({ ...form, dateFocus: true })}
                                        onBlur={() => setForm({ ...form, dateFocus: false })}
                                    />

                                    <div className="form-row-with-add">
                                        <div className="form-group main-input">
                                            <label className="input-label">Category</label>
                                            <select
                                                className="form-input" required
                                                value={form.category}
                                                onChange={e => setForm({ ...form, category: e.target.value, subcategory: '' })}
                                            >
                                                <option value="">Select Category</option>
                                                {expenseCategories.map(cat => (
                                                    <option key={cat.CategoryID} value={cat.CategoryID}>{cat.CategoryName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group add-button">
                                            <button 
                                                type="button" 
                                                className="btn-add-new" 
                                                title="Add New Category"
                                                onClick={() => setModalOpen({ ...modalOpen, category: true })}
                                            >
                                                <Plus size={14} /> Add New
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-row-with-add">
                                        <div className="form-group main-input">
                                            <label className="input-label">Sub Category</label>
                                            <select
                                                className="form-input" required
                                                value={form.subcategory}
                                                onChange={e => setForm({ ...form, subcategory: e.target.value })}
                                                disabled={!form.category}
                                            >
                                                <option value="">Select Subcategory</option>
                                                {subcategories.map(sub => (
                                                    <option key={sub.SubCategoryID} value={sub.SubCategoryID}>{sub.SubCategoryName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group add-button">
                                            <button 
                                                type="button" 
                                                className="btn-add-new" 
                                                title="Add New Subcategory"
                                                disabled={!form.category}
                                                onClick={() => setModalOpen({ ...modalOpen, subcategory: true })}
                                            >
                                                <Plus size={14} /> Add New
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-row-with-add">
                                        <div className="form-group main-input">
                                            <label className="input-label">Project Assignment</label>
                                            <select
                                                className="form-input" required
                                                value={form.project}
                                                onChange={e => setForm({ ...form, project: e.target.value })}
                                            >
                                                <option value="">Link to Project</option>
                                                {data?.projects?.map(p => (
                                                    <option key={p.ProjectID} value={p.ProjectID}>{p.ProjectName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group add-button">
                                            <button 
                                                type="button" 
                                                className="btn-add-new" 
                                                title="Add New Project"
                                                onClick={() => setModalOpen({ ...modalOpen, project: true })}
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
                                                value={form.people}
                                                onChange={e => setForm({ ...form, people: e.target.value })}
                                            >
                                                <option value="">Assigned To</option>
                                                {data?.people?.map(p => (
                                                    <option key={p.PeopleID} value={p.PeopleID}>{p.PeopleName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group add-button">
                                            <button 
                                                type="button" 
                                                className="btn-add-new" 
                                                title="Add New Staff"
                                                onClick={() => setModalOpen({ ...modalOpen, staff: true })}
                                            >
                                                <Plus size={14} /> Add New
                                            </button>
                                        </div>
                                    </div>

                                    <Input
                                        label="Amount (₹)" type="text" required
                                        value={form.amount}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                setForm({ ...form, amount: val });
                                            }
                                        }}
                                        placeholder="Enter amount"
                                        inputMode="decimal"
                                    />

                                    <div className="form-group">
                                        <label className="input-label">Remarks</label>
                                        <textarea
                                            className="form-input"
                                            style={{ minHeight: '80px', resize: 'vertical' }}
                                            value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })}
                                            placeholder="Notes about this transaction..."
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            style={{ flex: 1 }}
                                            onClick={resetForm}
                                            disabled={loading}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ flex: 2 }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : isEditing ? 'Update' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}


                {/* Data Table */}
                <div style={{ flex: 1 }}>
                    <Card title="Expense Logs">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Details</th>
                                        <th>Project & Staff</th>
                                        <th style={{ textAlign: 'right' }}>Amount</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.expenses || []).filter(item => item).map(item => (
                                        <tr key={item.ExpenseID}>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontWeight: 600 }}>{getCategoryName(item.CategoryID)}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {getSubCategoryName(item.CategoryID, item.SubCategoryID)} • {item.ExpenseDate ? item.ExpenseDate.split('T')[0].split('-').reverse().join('-') : ''}
                                                    </span>
                                                    {item.Description && (
                                                        <span style={{ fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic', color: 'var(--primary)' }}>
                                                            Note: {item.Description}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '0.85rem' }}>{getProjectName(item.ProjectID)}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getPeopleName(item.PeopleID)}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '1rem' }}>
                                                    -₹{Number(item.Amount).toLocaleString()}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="btn-icon"
                                                        style={{ color: 'var(--primary)', padding: '4px' }}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (window.confirm('Delete expense?')) deleteItem('expenses', item.ExpenseID) }}
                                                        className="btn-icon"
                                                        style={{ color: 'var(--danger)', padding: '4px' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data?.expenses || data.expenses.length === 0) && (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                                No expense transactions recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
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
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Adding to: {getCategoryName(parseInt(form.category))}</p>
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
        </div>
    );
};



export default Expenses;
