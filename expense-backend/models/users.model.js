const db = require("../db/mysql");

async function getAll() {
    try {
        const [data, fields] = await db.query("SELECT * FROM users");
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getById(id) {
    try {
        const [data, fields] = await db.query(
            `SELECT * FROM users WHERE UserID = ${id}`
        );
        return data[0];
    } catch (err) {
        return false;
    }
}

async function findByEmail(email) {
    try {
        const [data, fields] = await db.query(
            `SELECT * FROM users WHERE EmailAddress = '${email}'`
        );
        return data[0];
    } catch (err) {
        return false;
    }
}

async function insert(formData) {
    try {
        const [data, fields] = await db.query(`
            INSERT INTO users
            (UserID, UserName, EmailAddress, Password, MobileNo, ProfileImage, Role, Created, Modified)
            VALUES
            (
                NULL,
                '${formData.UserName}',
                '${formData.EmailAddress}',
                '${formData.Password}',
                '${formData.MobileNo}',
                '${formData.ProfileImage}',
                '${formData.Role || 'user'}',
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
        let updates = [];
        if (formData.UserName) updates.push(`UserName = '${formData.UserName}'`);
        if (formData.EmailAddress) updates.push(`EmailAddress = '${formData.EmailAddress}'`);
        if (formData.Password) updates.push(`Password = '${formData.Password}'`);
        if (formData.MobileNo) updates.push(`MobileNo = '${formData.MobileNo}'`);
        if (formData.ProfileImage) updates.push(`ProfileImage = '${formData.ProfileImage}'`);
        if (formData.Role) updates.push(`Role = '${formData.Role}'`);

        updates.push(`Modified = NOW()`);

        const query = `UPDATE users SET ${updates.join(', ')} WHERE UserID = ${id}`;

        const [data, fields] = await db.query(query);
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteById(id) {
    try {
        const [data, fields] = await db.query(
            `DELETE FROM users WHERE UserID = ${id}`
        );
        return data;
    } catch (err) {
        return false;
    }
}

module.exports = { getAll, getById, insert, deleteById, update, findByEmail };