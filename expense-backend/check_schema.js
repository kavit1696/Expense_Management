const db = require('./db/mysql');

async function checkSchema() {
    try {
        const [rows] = await db.query("DESCRIBE users");
        console.log("Users Table Schema:");
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkSchema();
