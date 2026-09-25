const { getAll, getById, insert, deleteById, update } = require("../models/projects.model");

async function getAllProjects(userId) {
    const data = await getAll(userId)

    if (data) {
        return {
            error: false,
            data,
            message: "projects fetched successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while fetching projects"
        }
    }
}

async function getProjectByID(id) {
    const data = await getById(id)

    if (data) {
        return {
            error: false,
            data,
            message: "project fetched by id successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while fetching project"
        }
    }
}

async function insertProjects(formData) {
    const data = await insert(formData)

    if (data) {
        return {
            error: false,
            data,
            message: "project inserted successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while inserting project"
        }
    }
}

async function updateProjects(id, formData) {
    const data = await update(id, formData)

    if (data) {
        return {
            error: false,
            data,
            message: "project updated successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while updating project"
        }
    }
}

async function deleteProjects(id) {
    const data = await deleteById(id)

    if (data) {
        return {
            error: false,
            data,
            message: "project deleted successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while deleting project"
        }
    }
}
module.exports = { getAllProjects, getProjectByID, insertProjects, updateProjects, deleteProjects }