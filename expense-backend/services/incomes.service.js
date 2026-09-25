const { getAll, getById, insert, deleteById, update } = require("../models/incomes.model");

async function getAllIncomes(userId) {
    const data = await getAll(userId);

    if (data) {
        return {
            error: false,
            data,
            message: "incomes fetched successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching incomes"
        };
    }
}

async function getIncomeByID(id) {
    const data = await getById(id);

    if (data) {
        return {
            error: false,
            data,
            message: "income fetched by id successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching income"
        };
    }
}

async function insertIncomes(formData) {
    const data = await insert(formData);

    if (data) {
        return {
            error: false,
            data,
            message: "income inserted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while inserting income"
        };
    }
}

async function updateIncomes(id, formData) {
    const data = await update(id, formData);

    if (data) {
        return {
            error: false,
            data,
            message: "income updated successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while updating income"
        };
    }
}

async function deleteIncomes(id) {
    const data = await deleteById(id);

    if (data) {
        return {
            error: false,
            data,
            message: "income deleted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while deleting income"
        };
    }
}

module.exports = { getAllIncomes, getIncomeByID, insertIncomes, updateIncomes, deleteIncomes };