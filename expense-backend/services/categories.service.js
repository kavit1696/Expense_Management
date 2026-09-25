const { getAll, getById, insert, deleteById, update } = require("../models/categories.model");

async function getAllCategories(userId) {
    const data = await getAll(userId)

    if (data) {
        return {
            error: false,
            data,
            message: "categories fetched successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while fetching categories"
        }
    }
}

async function getCategoryByID(id) {
    const data = await getById(id)

    if (data) {
        return {
            error: false,
            data,
            message: "category fetched by id successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while fetching category"
        }
    }
}

async function insertCategories(formData) {
    const data = await insert(formData)

    if (data) {
        return {
            error: false,
            data,
            message: "category inserted successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while inserting category"
        }
    }
}

async function updateCategories(id, formData) {
    const data = await update(id, formData)

    if (data) {
        return {
            error: false,
            data,
            message: "category updated successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while updating category"
        }
    }
}

async function deleteCategories(id) {
    const data = await deleteById(id)

    if (data) {
        return {
            error: false,
            data,
            message: "category deleted successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while deleting category"
        }
    }
}
module.exports = { getAllCategories, getCategoryByID, insertCategories, updateCategories, deleteCategories }