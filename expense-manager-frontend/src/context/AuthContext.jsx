import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            if (!response.data.error) {
                const userData = response.data.data;
                // Normalize role: DB returns 'Role' (capitalized based on model), ensure we have a consistent 'role' property
                const role = userData.Role || userData.role || 'user';
                const userWithRole = { ...userData, role: role };

                setUser(userWithRole);
                localStorage.setItem('user', JSON.stringify(userWithRole));
                return { success: true, user: userWithRole };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "An error occurred during login." };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/users', userData);
            if (response.data && !response.data.error) {
                return { success: true };
            } else {
                return { success: false, message: response.data.message || "Registration failed" };
            }
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, message: "An error occurred during registration." };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

