const db = require("../db/mysql")

async function getAll(userId) {
    try {
        const query = userId ? `SELECT * FROM projects WHERE UserID = ${userId}` : "SELECT * FROM projects";
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
        const [data, fields] = await db.query(`SELECT * FROM projects WHERE ProjectID = ${id}`)
        return data[0]
    }
    catch (err) {
        return false
    }
}

async function insert(formData) {
    try {
        const [data, fields] = await db.query(`INSERT INTO projects 
                                                (ProjectID, ProjectName, ProjectLogo, ProjectStartDate, ProjectEndDate, ProjectDetail, Description, UserID, Created, Modified, IsActive)
                                                VALUES 
                                                (NULL,
                                                '${formData.ProjectName}',
                                                '${formData.ProjectLogo}',
                                                '${formData.ProjectStartDate}',
                                                '${formData.ProjectEndDate}',
                                                '${formData.ProjectDetail}',
                                                '${formData.Description}',
                                                ${formData.UserID},
                                                NOW(),
                                                NOW(),
                                                1);
                                                `)
        return data
    }
    catch (err) {
        return false
    }
}

async function update(id, formData) {
    try {
        const [data, fields] = await db.query(`UPDATE projects SET 
                                                ProjectName = '${formData.ProjectName}',
                                                ProjectLogo = '${formData.ProjectLogo}',
                                                ProjectStartDate = '${formData.ProjectStartDate}',
                                                ProjectEndDate = '${formData.ProjectEndDate}',
                                                ProjectDetail = '${formData.ProjectDetail}',
                                                Description = '${formData.Description}',
                                                UserID = ${formData.UserID},
                                                Modified = NOW(),
                                                IsActive = ${formData.IsActive}
                                                WHERE ProjectID = ${id};
                                            `)
        return data
    }
    catch (err) {
        console.log(err);

        return false
    }
}

async function deleteById(id) {
    try {
        const [data, fields] = await db.query(`DELETE FROM projects WHERE ProjectID = ${id}`)
        return data
    }
    catch (err) {
        return false
    }
}

module.exports = { getAll, getById, insert, deleteById, update }