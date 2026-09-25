const db = require("../db/mysql")

async function getAll(userId) {
    try {
        const query = userId ? `SELECT * FROM peoples WHERE UserID = ${userId}` : "SELECT * FROM peoples";
        const [data, fields] = await db.query(query)
        return data
    }
    catch (err) {
        console.log(err);

        return false
    }
}

async function getById(id) {
    try {
        const [data, fields] = await db.query(`SELECT * FROM peoples WHERE PeopleID = ${id}`)
        return data[0]
    }
    catch (err) {
        return false
    }
}

async function insert(formData) {
    try {
        const [data, fields] = await db.query(`INSERT INTO peoples (PeopleID, PeopleCode, Password, PeopleName, Email, MobileNo, Description, UserID, Created, Modified, IsActive) VALUES (NULL,'${formData.PeopleCode}','${formData.Password}','${formData.PeopleName}','${formData.Email}','${formData.MobileNo}','${formData.Description}','${formData.UserID}', NOW(), NOW(), 1);`)
        return data
    }
    catch (err) {
        return false
    }
}

async function update(id, formData) {
    try {
        const [data, fields] = await db.query(`UPDATE peoples SET 
                                                PeopleCode = '${formData.PeopleCode}',
                                                PeopleName = '${formData.PeopleName}',
                                                Password = '${formData.Password}',
                                                Email = '${formData.Email}',
                                                MobileNo = '${formData.MobileNo}',
                                                Description = '${formData.Description}',
                                                UserID = ${formData.UserID},
                                                Modified = NOW(),
                                                IsActive = ${formData.IsActive}
                                                WHERE PeopleID = ${id};`)
        return data
    }
    catch (err) {
        return false
    }
}

async function deleteById(id) {
    try {
        const [data, fields] = await db.query(`DELETE FROM peoples WHERE PeopleID = ${id}`)
        return data
    }
    catch (err) {
        return false
    }
}

module.exports = { getAll, getById, insert, deleteById, update }