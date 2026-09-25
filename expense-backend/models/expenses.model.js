const db = require("../db/mysql");

async function getAll(userId) {
    try {
        const query = userId ? `SELECT * FROM expenses WHERE UserID = ${userId}` : "SELECT * FROM expenses";
        const [data, fields] = await db.query(query);
        return data;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function getById(id) {
    try {
        const [data, fields] = await db.query(`SELECT * FROM expenses WHERE ExpenseID = ${id}`);
        return data[0];
    }
    catch (err) {
        return false;
    }
}

async function insert(formData) {
    try {
        const [data, fields] = await db.query(`
            INSERT INTO expenses 
            (ExpenseID, ExpenseDate, CategoryID, SubCategoryID, PeopleID, ProjectID, Amount, ExpenseDetail, AttachmentPath, Description, UserID, Created, Modified)
            VALUES 
            (NULL,
            '${formData.ExpenseDate}',
            ${formData.CategoryID},
            ${formData.SubCategoryID},
            ${formData.PeopleID},
            ${formData.ProjectID},
            ${formData.Amount},
            '${formData.ExpenseDetail}',
            '${formData.AttachmentPath}',
            '${formData.Description}',
            ${formData.UserID},
            NOW(),
            NOW());
        `);
        return data;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function update(id, formData) {
    try {
        const [data, fields] = await db.query(`
            UPDATE expenses SET 
                ExpenseDate = '${formData.ExpenseDate}',
                CategoryID = ${formData.CategoryID},
                SubCategoryID = ${formData.SubCategoryID},
                PeopleID = ${formData.PeopleID},
                ProjectID = ${formData.ProjectID},
                Amount = ${formData.Amount},
                ExpenseDetail = '${formData.ExpenseDetail}',
                AttachmentPath = '${formData.AttachmentPath}',
                Description = '${formData.Description}',
                UserID = ${formData.UserID},
                Modified = NOW()
            WHERE ExpenseID = ${id};
        `);
        return data;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteById(id) {
    try {
        const [data, fields] = await db.query(`DELETE FROM expenses WHERE ExpenseID = ${id}`);
        return data;
    }
    catch (err) {
        return false;
    }
}

module.exports = { getAll, getById, insert, deleteById, update };