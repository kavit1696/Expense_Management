const { getAll, getById, insert, deleteById, update } = require("../models/subCategories.model");

async function getAllSubCategories() {
    const data = await getAll();
    
    if (data) {
        return {
            error: false,
            data,
            message: "sub categories fetched successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching sub categories"
        };
    }
}

async function getSubCategoryByID(id) {
    const data = await getById(id);
    
    if (data) {
        return {
            error: false,
            data,
            message: "sub category fetched by id successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching sub category"
        };
    }
}

async function insertSubCategories(formData) {
    const data = await insert(formData);
    
    if (data) {
        return {
            error: false,
            data,
            message: "sub category inserted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while inserting sub category"
        };
    }
}

async function updateSubCategories(id, formData) {
    const data = await update(id, formData);
    
    if (data) {
        return {
            error: false,
            data,
            message: "sub category updated successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while updating sub category"
        };
    }
}

async function deleteSubCategories(id) {
    const data = await deleteById(id);
    
    if (data) {
        return {
            error: false,
            data,
            message: "sub category deleted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while deleting sub category"
        };
    }
}

module.exports = {getAllSubCategories,getSubCategoryByID,insertSubCategories,updateSubCategories,deleteSubCategories};