const db = require("../db/mysql");

async function getAll() {
    try {
        const [data, fields] = await db.query("SELECT * FROM sub_categories");
        return data;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function getById(id) {
    try {
        const [data, fields] = await db.query(
            `SELECT * FROM sub_categories WHERE SubCategoryID = ${id}`
        );
        return data[0];
    }
    catch (err) {
        return false;
    }
}

async function insert(formData) {
    try {
        const [data, fields] = await db.query(`
            INSERT INTO sub_categories
            (SubCategoryID, CategoryID, SubCategoryName, LogoPath, IsExpense, IsIncome, IsActive, Description, UserID, Created, Modified, Sequence)
            VALUES
            (
                NULL,
                ${formData.CategoryID},
                '${formData.SubCategoryName}',
                '${formData.LogoPath}',
                ${formData.IsExpense},
                ${formData.IsIncome},
                1,
                '${formData.Description}',
                ${formData.UserID},
                NOW(),
                NOW(),
                ${formData.Sequence}
            );
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
                                            UPDATE sub_categories SET
                                            CategoryID = ${formData.CategoryID},
                                            SubCategoryName = '${formData.SubCategoryName}',
                                            LogoPath = '${formData.LogoPath}',
                                            IsExpense = ${formData.IsExpense},
                                            IsIncome = ${formData.IsIncome},
                                            Description = '${formData.Description}',
                                            UserID = ${formData.UserID},
                                            Modified = NOW(),
                                            IsActive = ${formData.IsActive},
                                            Sequence = ${formData.Sequence}
                                            WHERE SubCategoryID = ${id};
                                            `)
        return data;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteById(id) {
    try {
        const [data, fields] = await db.query(
            `DELETE FROM sub_categories WHERE SubCategoryID = ${id}`
        );
        return data;
    }
    catch (err) {
        return false;
    }
}

module.exports = {
    getAll,
    getById,
    insert,
    deleteById,
    update
};
