import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

const Categories = () => {
    const { data, addItem, updateItem, deleteItem } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const [loading, setLoading] = useState(false);

    // UI State
    const [name, setName] = useState('');
    const [type, setType] = useState('expense');
    const [subcategories, setSubcategories] = useState([]); // Array of objects { SubCategoryName: 'abc', ... }
    const [subInput, setSubInput] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name) return;
        if (subcategories.length === 0) {
            alert('Please add at least one subcategory.');
            return;
        }
        setLoading(true);

        const payload = {
            ...originalItem,
            CategoryName: name,
            IsExpense: type === 'expense' ? 1 : 0,
            IsIncome: type === 'income' ? 1 : 0,
            Description: originalItem?.Description || '',
            LogoPath: originalItem?.LogoPath || '',
            Sequence: originalItem?.Sequence || 0,
            IsActive: originalItem?.IsActive ?? 1,
            subcategories: subcategories
        };

        let success = false;
        if (isEditing) {
            success = await updateItem('categories', editId, payload);
        } else {
            success = await addItem('categories', payload);
        }
        setLoading(false);
        if (success) {
            resetForm();
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setOriginalItem(null);
        setName('');
        setType('expense');
        setSubcategories([]);
        setSubInput('');
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setEditId(category.CategoryID);
        setOriginalItem(category);
        setName(category.CategoryName);
        setType(category.IsExpense == 1 ? 'expense' : 'income');
        setSubcategories(category.subcategories || []);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const success = await deleteItem('categories', id);
            if (!success) {
                alert('Could not delete category. It might be in use by expenses or incomes.');
            }
        }
    };

    const addSubcategory = () => {
        if (subInput.trim()) {
            // Check for duplicates
            if (!subcategories.some(sub => sub.SubCategoryName.toLowerCase() === subInput.trim().toLowerCase())) {
                setSubcategories([...subcategories, { SubCategoryName: subInput.trim() }]);
                setSubInput('');
            }
        }
    };

    const removeSubcategory = (index) => {
        const newSubs = [...subcategories];
        newSubs.splice(index, 1);
        setSubcategories(newSubs);
    };

    return (
        <div className="container">
            <div className="section" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1>Category Management</h1>
                </div>

                <div className="grid-form">
                    {/* Form Section */}
                    <Card title={isEditing ? 'Edit Category' : 'Add New Category'}>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <Input
                                    label="Category Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Travel"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-input"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subcategories</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Input
                                        placeholder="Add subcategory"
                                        value={subInput}
                                        onChange={e => setSubInput(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <Button type="button" onClick={addSubcategory} variant="outline" style={{ height: '42px', width: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={16} /></Button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {subcategories.map((sub, index) => (
                                        <span key={index} className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            {sub.SubCategoryName}
                                            <button type="button" onClick={() => removeSubcategory(index)} style={{ display: 'flex', cursor: 'pointer' }}><X size={12} /></button>
                                        </span>
                                    ))}
                                    {subcategories.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>* At least one subcategory is required</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <Button type="submit" variant="primary" style={{ flex: 1 }} disabled={loading}>{isEditing ? 'Update' : 'Save'}</Button>
                                {isEditing && <Button type="button" onClick={resetForm} variant="ghost" disabled={loading}>Cancel</Button>}
                            </div>
                        </form>
                    </Card>

                    {/* List Section */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <Card title="Category List">
                            <Table headers={['Category Name', 'Type', 'Subcategories', 'Actions']}>
                                {(data?.categories || []).filter(c => c).map(cat => (
                                    <tr key={cat.CategoryID}>
                                        <td><strong>{cat.CategoryName}</strong></td>
                                        <td>
                                            <span className={`badge ${cat.IsIncome == 1 ? 'badge-success' : 'badge-danger'}`}>
                                                {cat.IsIncome == 1 ? 'Income' : 'Expense'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                {cat.subcategories && cat.subcategories.map((sub, idx) => (
                                                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', background: 'var(--bg-body)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                                        {sub.SubCategoryName}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleEdit(cat)} style={{ color: 'var(--info)' }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(cat.CategoryID)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </Table>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
