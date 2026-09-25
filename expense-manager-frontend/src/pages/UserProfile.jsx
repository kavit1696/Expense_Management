import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Save, X, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const UserProfile = () => {
    const { user, login, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Profile Form Data
    const [formData, setFormData] = useState({
        UserName: '',
        EmailAddress: '',
        MobileNo: '',
        currentPassword: ''
    });

    // Password Form Data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                UserName: user.UserName || '',
                EmailAddress: user.EmailAddress || '',
                MobileNo: user.MobileNo || '',
                currentPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.currentPassword !== user.Password) {
            alert("Incorrect current password. Please try again.");
            return;
        }
        setLoading(true);
        try {
            const res = await api.patch(`/users/${user.UserID}`, {
                UserName: formData.UserName,
                EmailAddress: formData.EmailAddress,
                MobileNo: formData.MobileNo
            });

            if (res.data?.success || res.status === 200) {
                alert("Profile updated successfully!");
                setIsEditing(false);
                updateUser({
                    UserName: formData.UserName,
                    EmailAddress: formData.EmailAddress,
                    MobileNo: formData.MobileNo
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        if (passwordData.currentPassword !== user.Password) {
            alert("Incorrect current password. Please try again.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            // Assuming endpoint supports password update via PATCH or a specific endpoint
            // Since we don't have a specific change-password endpoint documented, we'll try patching the user
            // Important: Backend must handle hashing. If purely frontend mock, we send as is.

            const payload = {
                Password: passwordData.newPassword
                // Typically you'd send currentPassword for verification too
            };

            const res = await api.patch(`/users/${user.UserID}`, payload);

            if (res.data?.success || res.status === 200) {
                alert("Password changed successfully!");
                setIsChangingPassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Failed to change password. Please ensuring your current password is correct.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading Profile...</div>;

    return (
        <div className="dashboard-container max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            </div>

            <div className="space-y-6">
                {/* Section 1: Header / Profile Info */}
                <Card className="p-6">
                    <div className="overflow-hidden">

                        <div className="pt-2">
                            <h2 className="text-2xl font-bold mb-2">{user.UserName}</h2>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium inline-block ${user.Role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                {user.Role === 'admin' ? 'Administrator' : 'Standard User'}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Section 2: Security */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Security</h3>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                                setIsChangingPassword(true);
                                setIsEditing(false);
                            }}
                        >
                            <Lock size={16} /> Change Password
                        </Button>
                    </div>
                    {isChangingPassword && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <form onSubmit={handleSubmitPassword} className="space-y-4 max-w-md">
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 text-sm rounded-lg mb-4">
                                    Ensure your new password is at least 6 characters long.
                                </div>
                                <Input
                                    label="Current Password"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </Card>

                {/* Section 3: Personal Details */}
                <Card title="Personal Details" className="p-6">
                    {!isEditing ? (
                        <div className="space-y-6">
                            <div className="space-y-4 text-base">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <span className="font-semibold text-muted w-32"><b>Full Name: </b></span>
                                    <span className="font-medium text-lg">{user.UserName}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <span className="font-semibold text-muted w-32"><b>Email: </b></span>
                                    <span className="font-medium text-lg">{user.EmailAddress}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <span className="font-semibold text-muted w-32"><b>Mobile Number: </b></span>
                                    <span className="font-medium text-lg">{user.MobileNo || '-'}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pb-3">
                                    <span className="font-semibold text-muted w-32"><b>Role: </b></span>
                                    <span className="font-medium text-lg capitalize">{user.Role}</span>
                                </div>
                            </div>

                            <div className="pt-6 mt-4 flex justify-center">
                                <Button onClick={() => { setIsEditing(true); setIsChangingPassword(false); }} variant="outline" className="px-8 py-2"> Edit Profile </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
                            <Input
                                label="Full Name"
                                name="UserName"
                                value={formData.UserName}
                                onChange={handleChange}
                                icon={<User size={18} />}
                            />
                            <Input
                                label="Email Address"
                                name="EmailAddress"
                                type="email"
                                value={formData.EmailAddress}
                                onChange={handleChange}
                                icon={<Mail size={18} />}
                            />
                            <Input
                                label="Mobile Number"
                                name="MobileNo"
                                value={formData.MobileNo}
                                onChange={handleChange}
                                icon={<Phone size={18} />}
                            />

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 text-sm rounded-lg mb-4">
                                    Please enter your current password to save these changes.
                                </div>
                                <Input
                                    label="Current Password"
                                    name="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    icon={<Lock size={18} />}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-center pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" disabled={loading} className="px-8">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;
