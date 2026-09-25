import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState({
        expenses: [],
        incomes: [],
        categories: [],
        projects: [],
        people: []
    });
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user || !user.UserID) return;
        setLoading(true);
        try {
            // If admin, fetch all data (no userId param). If user, filter by userId.
            // Note: Ensure backend supports empty userId returning all data for these endpoints.
            const queryParam = user.role === 'admin' ? '' : `?userId=${user.UserID}`;

            const [expensesRes, incomesRes, categoriesRes, projectsRes, peopleRes] = await Promise.all([
                api.get(`/expenses${queryParam}`),
                api.get(`/incomes${queryParam}`),
                api.get(`/categories${queryParam}`),
                api.get(`/projects${queryParam}`),
                api.get(`/peoples${queryParam}`)
            ]);

            setData({
                expenses: expensesRes.data?.data || [],
                incomes: incomesRes.data?.data || [],
                categories: categoriesRes.data?.data || [],
                projects: projectsRes.data?.data || [],
                people: peopleRes.data?.data || []
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addItem = async (key, item) => {
        if (!user || !user.UserID) return false;
        try {
            const newItem = { ...item };
            if (!newItem.UserID) newItem.UserID = user.UserID;
            // Map key to endpoint
            const endpoint = key === 'people' ? 'peoples' : key;

            await api.post(`/${endpoint}`, newItem);
            await fetchData(); // Refresh data and wait for it
            return true;
        } catch (error) {
            console.error(`Error adding ${key}:`, error);
            return false;
        }
    };

    const updateItem = async (key, id, updatedItem) => {
        if (!user || !user.UserID) return false;
        try {
            const newItem = { ...updatedItem };
            if (!newItem.UserID) newItem.UserID = user.UserID;
            const endpoint = key === 'people' ? 'peoples' : key;
            await api.patch(`/${endpoint}/${id}`, newItem);
            await fetchData();
            return true;
        } catch (error) {
            console.error(`Error updating ${key}:`, error);
            return false;
        }
    };

    const deleteItem = async (key, id) => {
        try {
            const endpoint = key === 'people' ? 'peoples' : key;
            await api.delete(`/${endpoint}/${id}`);
            await fetchData();
            return true;
        } catch (error) {
            console.error(`Error deleting ${key}:`, error);
            return false;
        }
    };

    return (
        <DataContext.Provider value={{
            data,
            loading,
            addItem,
            updateItem,
            deleteItem,
            refreshData: fetchData
        }}>
            {children}
        </DataContext.Provider>
    );
};

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

