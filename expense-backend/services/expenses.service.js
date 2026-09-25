const { getAll, getById, insert, deleteById, update } = require("../models/expenses.model");

async function getAllExpenses(userId) {
    const data = await getAll(userId);

    if (data) {
        return {
            error: false,
            data,
            message: "expenses fetched successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching expenses"
        };
    }
}

async function getExpenseByID(id) {
    const data = await getById(id);

    if (data) {
        return {
            error: false,
            data,
            message: "expense fetched by id successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching expense"
        };
    }
}

async function insertExpenses(formData) {
    const data = await insert(formData);

    if (data) {
        return {
            error: false,
            data,
            message: "expense inserted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while inserting expense"
        };
    }
}

async function updateExpenses(id, formData) {
    const data = await update(id, formData);

    if (data) {
        return {
            error: false,
            data,
            message: "expense updated successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while updating expense"
        };
    }
}

async function deleteExpenses(id) {
    const data = await deleteById(id);

    if (data) {
        return {
            error: false,
            data,
            message: "expense deleted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while deleting expense"
        };
    }
}

module.exports = { getAllExpenses, getExpenseByID, insertExpenses, updateExpenses, deleteExpenses }