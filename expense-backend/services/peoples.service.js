const { getAll, getById, insert, deleteById, update } = require("../models/peoples.model");

async function getAllPeoples(userId) {
    const data = await getAll(userId)

    if (data) {
        return {
            error: false,
            data,
            message: "peoples fetched successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while fetching peoples"
        }
    }
}

async function getPeopleByID(id) {
    const data = await getById(id)

    if (data) {
        return {
            error: false,
            data,
            message: "people fetched by id successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while fetching people"
        }
    }
}

async function insertPeoples(formData) {
    const data = await insert(formData)

    if (data) {
        return {
            error: false,
            data,
            message: "people inserted successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while inserting people"
        }
    }
}

async function updatePeoples(id, formData) {
    const data = await update(id, formData)

    if (data) {
        return {
            error: false,
            data,
            message: "people updated successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while updating people"
        }
    }
}

async function deletePeoples(id) {
    const data = await deleteById(id)

    if (data) {
        return {
            error: false,
            data,
            message: "people deleted successfully"
        }
    }
    else {
        return {
            error: true,
            message: "some error occured while deleting people"
        }
    }
}
module.exports = { getAllPeoples, getPeopleByID, insertPeoples, updatePeoples, deletePeoples }