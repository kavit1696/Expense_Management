const db = require('./db/mysql');

async function promoteAdmin() {
    try {
        console.log("Promoting admin@gmail.com to admin...");
        await db.query("UPDATE users SET Role = 'admin' WHERE EmailAddress = 'admin@gmail.com'");
        console.log("Promotion successful.");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

promoteAdmin();
