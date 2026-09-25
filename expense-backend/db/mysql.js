require("dotenv").config();
const { createPool } = require("mysql2/promise");

const db = createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "expense_manager",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    connectionLimit: 10,
    typeCast: function (field, next) {
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            // jo buffer null hoy,to return null
            if (bytes === null) return null;
            // Return integer value (0 ka 1)
            return bytes[0];
        }
        return next();
    }
});

module.exports = db;