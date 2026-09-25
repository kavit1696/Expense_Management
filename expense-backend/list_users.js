const db = require('./db/mysql');

async function listUsers() {
    try {
        const [rows] = await db.query("SELECT UserID, UserName, EmailAddress, Role FROM users");
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

listUsers();
