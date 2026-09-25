const { getAll, getById, insert, deleteById, update, findByEmail } = require("../models/users.model");

async function getAllUsers() {
    const data = await getAll();

    if (data) {
        return {
            error: false,
            data,
            message: "users fetched successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching users"
        };
    }
}

async function login(credentials) {
    const user = await findByEmail(credentials.email);

    if (user && user.Password === credentials.password) {
        return {
            error: false,
            data: user,
            message: "login successful"
        };
    } else {
        return {
            error: true,
            message: "Invalid email or password"
        };
    }
}

async function getUserByID(id) {
    const data = await getById(id);

    if (data) {
        return {
            error: false,
            data,
            message: "user fetched by id successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while fetching user"
        };
    }
}

async function insertUsers(formData) {
    const data = await insert(formData);

    if (data) {
        return {
            error: false,
            data,
            message: "user inserted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while inserting user"
        };
    }
}

async function updateUsers(id, formData) {
    const data = await update(id, formData);

    if (data) {
        return {
            error: false,
            data,
            message: "user updated successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while updating user"
        };
    }
}

async function deleteUsers(id) {
    const data = await deleteById(id);

    if (data) {
        return {
            error: false,
            data,
            message: "user deleted successfully"
        };
    } else {
        return {
            error: true,
            message: "some error occurred while deleting user"
        };
    }
}

module.exports = { getAllUsers, getUserByID, insertUsers, updateUsers, deleteUsers, login };