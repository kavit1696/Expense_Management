const db = require("../db/mysql");

async function getAll(userId) {
    try {
        const query = userId ? `SELECT * FROM incomes WHERE UserID = ${userId}` : "SELECT * FROM incomes";
        const [data, fields] = await db.query(query);
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getById(id) {
    try {
        const [data, fields] = await db.query(
            `SELECT * FROM incomes WHERE IncomeID = ${id}`
        );
        return data[0];
    } catch (err) {
        return false;
    }
}

async function insert(formData) {
    try {
        const [data, fields] = await db.query(`
            INSERT INTO incomes
            (IncomeID, IncomeDate, CategoryID, SubCategoryID, PeopleID, ProjectID, Amount, IncomeDetail, AttachmentPath, Description, UserID, Created, Modified)
            VALUES
            (
                NULL,
                '${formData.IncomeDate}',
                ${formData.CategoryID},
                ${formData.SubCategoryID},
                ${formData.PeopleID},
                ${formData.ProjectID},
                ${formData.Amount},
                '${formData.IncomeDetail}',
                '${formData.AttachmentPath}',
                '${formData.Description}',
                ${formData.UserID},
                NOW(),
                NOW()
            );
        `);
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function update(id, formData) {
    try {
        const [data, fields] = await db.query(`
            UPDATE incomes SET
                IncomeDate = '${formData.IncomeDate}',
                CategoryID = ${formData.CategoryID},
                SubCategoryID = ${formData.SubCategoryID},
                PeopleID = ${formData.PeopleID},
                ProjectID = ${formData.ProjectID},
                Amount = ${formData.Amount},
                IncomeDetail = '${formData.IncomeDetail}',
                AttachmentPath = '${formData.AttachmentPath}',
                Description = '${formData.Description}',
                UserID = ${formData.UserID},
                Modified = NOW()
            WHERE IncomeID = ${id};
        `);
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteById(id) {
    try {
        const [data, fields] = await db.query(
            `DELETE FROM incomes WHERE IncomeID = ${id}`
        );
        return data;
    } catch (err) {
        return false;
    }
}

module.exports = { getAll, getById, insert, deleteById, update };