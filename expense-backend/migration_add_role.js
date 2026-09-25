const db = require('./db/mysql');

async function addRoleColumn() {
    try {
        console.log("Adding Role column...");
        await db.query("ALTER TABLE users ADD COLUMN Role VARCHAR(50) DEFAULT 'user'");
        console.log("Role column added successfully.");

        // Optional: Set a specific user as admin for testing if needed
        // await db.query("UPDATE users SET Role = 'admin' WHERE EmailAddress = 'admin@example.com'");

        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Role column already exists.");
            process.exit(0);
        }
        console.error("Error:", err);
        process.exit(1);
    }
}

addRoleColumn();
