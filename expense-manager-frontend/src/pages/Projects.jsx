import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import { Trash2, Edit2 } from 'lucide-react';

const Projects = () => {
    const { data, addItem, updateItem, deleteItem } = useData();

    // Projects State
    const [projectForm, setProjectForm] = useState({ name: '', status: 'Active', startDate: '', dateFocus: false });
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [loading, setLoading] = useState(false);

    // People State
    const [peopleForm, setPeopleForm] = useState({ name: '', email: '', role: 'Employee', mobile: '' });
    const [isEditingPerson, setIsEditingPerson] = useState(false);
    const [peopleId, setPeopleId] = useState(null);

    // Projects Handlers
    const handleProjectSave = async (e) => {
        e.preventDefault();
        if (!projectForm.name) return;
        setLoading(true);

        const payload = {
            ProjectName: projectForm.name,
            ProjectStartDate: projectForm.startDate,
            ProjectEndDate: projectForm.startDate, // Default to start date if no end date
            ProjectDetail: projectForm.status,
            Description: projectForm.status,
            ProjectLogo: '',
            IsActive: projectForm.status === 'Active' ? 1 : 0
        };

        let success = false;
        if (isEditingProject) {
            success = await updateItem('projects', projectId, payload);
            if (success) {
                setIsEditingProject(false);
                setProjectId(null);
            }
        } else {
            success = await addItem('projects', payload);
        }
        setLoading(false);
        if (success) {
            setProjectForm({ name: '', status: 'Active', startDate: '', dateFocus: false });
        }
    };

    const editProject = (proj) => {
        setIsEditingProject(true);
        setProjectId(proj.ProjectID);
        setProjectForm({
            name: proj.ProjectName,
            status: proj.ProjectDetail || 'Active',
            startDate: proj.ProjectStartDate,
            dateFocus: false
        });
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Delete project?')) {
            deleteItem('projects', id);
        }
    }

    // People Handlers
    const handlePeopleSave = async (e) => {
        e.preventDefault();
        if (!peopleForm.name) return;
        setLoading(true);

        const payload = {
            PeopleName: peopleForm.name,
            Email: peopleForm.email,
            MobileNo: peopleForm.mobile,
            PeopleCode: peopleForm.name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000),
            Password: 'defaultPassword', // Backend requires it
            Description: peopleForm.role,
            IsActive: 1
        };

        let success = false;
        if (isEditingPerson) {
            success = await updateItem('people', peopleId, payload);
            if (success) {
                setIsEditingPerson(false);
                setPeopleId(null);
            }
        } else {
            success = await addItem('people', payload);
        }
        setLoading(false);
        if (success) {
            setPeopleForm({ name: '', email: '', role: 'Employee', mobile: '' });
        }
    };

    const editPerson = (person) => {
        setIsEditingPerson(true);
        setPeopleId(person.PeopleID);
        setPeopleForm({
            name: person.PeopleName,
            email: person.Email,
            role: person.Description, // Using Description for Role storage
            mobile: person.MobileNo
        });
    };

    const handleDeletePerson = (id) => {
        if (window.confirm('Delete person?')) {
            deleteItem('people', id);
        }
    }

    return (
        <div className="container">
            {/* Projects Section */}
            <div className="section">
                <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <h2>Project Management</h2>
                </div>
                <div className="grid-form">
                    <Card title={isEditingProject ? "Edit Project" : "Add Project"}>
                        <form onSubmit={handleProjectSave} className="grid-form" style={{ gridTemplateColumns: '1fr' }}>
                            <Input
                                label="Project Name"
                                value={projectForm.name}
                                onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Start Date"
                                type={projectForm.dateFocus ? "date" : "text"}
                                value={projectForm.dateFocus ? projectForm.startDate : (projectForm.startDate ? projectForm.startDate.split('T')[0].split('-').reverse().join('-') : '')}
                                onChange={e => setProjectForm({ ...projectForm, startDate: e.target.value })}
                                onFocus={() => setProjectForm({ ...projectForm, dateFocus: true })}
                                onBlur={() => setProjectForm({ ...projectForm, dateFocus: false })}
                                required
                            />
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-input"
                                    value={projectForm.status}
                                    onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}
                                    required
                                >
                                    <option>Active</option>
                                    <option>Planning</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" style={{ flex: 1 }} disabled={loading}>{isEditingProject ? 'Update' : 'Add'}</Button>
                                {isEditingProject && <Button type="button" variant="ghost" onClick={() => { setIsEditingProject(false); setProjectForm({ name: '', status: 'Active', startDate: '', dateFocus: false }); }} disabled={loading}>Cancel</Button>}
                            </div>
                        </form>
                    </Card>

                    <div style={{ gridColumn: 'span 1' }}>
                        <Card title="Project List">
                            <Table headers={['Project Name', 'Start Date', 'Status', 'Actions']}>
                                {(data?.projects || []).filter(p => p).map(p => (
                                    <tr key={p.ProjectID}>
                                        <td><strong>{p.ProjectName}</strong></td>
                                        <td>{p.ProjectStartDate ? p.ProjectStartDate.split('T')[0].split('-').reverse().join('-') : '-'}</td>
                                        <td>
                                            <span className={`badge ${p.ProjectDetail === 'Active' ? 'badge-success' :
                                                p.ProjectDetail === 'Completed' ? 'badge-info' : 'badge-warning'
                                                }`}>
                                                {p.ProjectDetail}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => editProject(p)} style={{ color: 'var(--primary)' }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteProject(p.ProjectID)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </Table>
                        </Card>
                    </div>
                </div>
            </div>

            <hr style={{ margin: '2rem 0', border: '0', borderTop: '1px solid var(--border-color)' }} />

            {/* People Section */}
            <div className="section">
                <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <h2>People Management</h2>
                </div>
                <div className="grid-form">
                    <Card title={isEditingPerson ? "Edit Person" : "Add Person"}>
                        <form onSubmit={handlePeopleSave} className="grid-form" style={{ gridTemplateColumns: '1fr' }}>
                            <Input
                                label="Name"
                                value={peopleForm.name}
                                onChange={e => setPeopleForm({ ...peopleForm, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={peopleForm.email}
                                onChange={e => setPeopleForm({ ...peopleForm, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Mobile"
                                value={peopleForm.mobile}
                                onChange={e => setPeopleForm({ ...peopleForm, mobile: e.target.value })}
                                required
                            />
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-input"
                                    value={peopleForm.role}
                                    onChange={e => setPeopleForm({ ...peopleForm, role: e.target.value })}
                                    required
                                >
                                    <option>Employee</option>
                                    <option>Manager</option>
                                    <option>Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" style={{ flex: 1 }} disabled={loading}>{isEditingPerson ? 'Update' : 'Add'}</Button>
                                {isEditingPerson && <Button type="button" variant="ghost" onClick={() => { setIsEditingPerson(false); setPeopleForm({ name: '', email: '', role: 'Employee', mobile: '' }); }} disabled={loading}>Cancel</Button>}
                            </div>
                        </form>
                    </Card>

                    <div>
                        <Card title="Staff List">
                            <Table headers={['Name', 'Email', 'Role', 'Actions']}>
                                {(data?.people || []).filter(p => p).map(p => (
                                    <tr key={p.PeopleID}>
                                        <td><strong>{p.PeopleName}</strong></td>
                                        <td>{p.Email}</td>
                                        <td><span className="badge badge-neutral">{p.Description}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => editPerson(p)} style={{ color: 'var(--primary)' }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeletePerson(p.PeopleID)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
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

export default Projects;
