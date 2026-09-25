const db = require("../db/mysql")

async function getAll(userId) {
    try {
        const catQuery = userId ? `SELECT * FROM categories WHERE UserID = ${userId}` : "SELECT * FROM categories";
        const [categories] = await db.query(catQuery)

        const subCatQuery = userId ? `SELECT * FROM sub_categories WHERE UserID = ${userId}` : "SELECT * FROM sub_categories";
        const [subCategories] = await db.query(subCatQuery)

        const result = categories.map(cat => {
            return {
                ...cat,
                subcategories: subCategories.filter(sub => sub.CategoryID === cat.CategoryID)
            }
        });
        return result
    }
    catch (err) {
        console.log(err);
        return false
    }
}

async function getById(id) {
    try {
        const [data, fields] = await db.query(`SELECT * FROM categories WHERE CategoryID = ${id};`)
        const [subCategories] = await db.query(`SELECT * FROM sub_categories WHERE CategoryID = ${id};`)

        if (data[0]) {
            data[0].subcategories = subCategories;
        }
        return data[0]
    }
    catch (err) {
        return false
    }
}

async function insert(formData) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Check if category exists
        const [existing] = await connection.query(`SELECT CategoryID, IsExpense, IsIncome FROM categories 
                                                   WHERE CategoryName = '${formData.CategoryName}' 
                                                   AND UserID = ${formData.UserID}`);

        let categoryId;

        if (existing.length > 0) {
            // Category exists, use it
            categoryId = existing[0].CategoryID;

            // Optional: Update flags if needed (e.g. if merging types)
            // For now, let's update proper flags to ensure "Type not set" issue is resolved if user re-submits
            await connection.query(`UPDATE categories SET 
                                    IsExpense = ${formData.IsExpense}, 
                                    IsIncome = ${formData.IsIncome},
                                    Modified = NOW()
                                    WHERE CategoryID = ${categoryId}`);
        } else {
            // Insert new
            const [result] = await connection.query(`INSERT INTO categories 
                                            (CategoryID, CategoryName, LogoPath, IsExpense, IsIncome, IsActive, Description, UserID, Created, Modified, Sequence)
                                            VALUES 
                                            (NULL,
                                            '${formData.CategoryName}',
                                            '${formData.LogoPath}',
                                            ${formData.IsExpense},
                                            ${formData.IsIncome},
                                            1,
                                            '${formData.Description}',
                                            ${formData.UserID},
                                            NOW(),
                                            NOW(),
                                            ${formData.Sequence});
                                            `);
            categoryId = result.insertId;
        }

        if (formData.subcategories && Array.isArray(formData.subcategories)) {
            for (const sub of formData.subcategories) {
                // Ensure we handle both string array (legacy compatibility) and object array
                const subName = typeof sub === 'string' ? sub : sub.SubCategoryName;
                if (subName) {
                    // Check if subcategory exists for this category to avoid duplicates
                    const [existingSub] = await connection.query(`SELECT SubCategoryID FROM sub_categories 
                                                                  WHERE CategoryID = ${categoryId} 
                                                                  AND SubCategoryName = '${subName}'`);

                    if (existingSub.length === 0) {
                        await connection.query(`INSERT INTO sub_categories
                            (SubCategoryID, CategoryID, SubCategoryName, LogoPath, IsExpense, IsIncome, IsActive, Description, UserID, Created, Modified, Sequence)
                            VALUES
                            (NULL, ${categoryId}, '${subName}', '', ${formData.IsExpense}, ${formData.IsIncome}, 1, '', ${formData.UserID}, NOW(), NOW(), 0)
                        `);
                    }
                }
            }
        }

        await connection.commit();
        // Return something meaningful. If we updated, we might not have 'insertId' in the same way,
        // but the frontend likely verifies success and re-fetches.
        return { insertId: categoryId, affectedRows: 1 };
    }
    catch (err) {
        if (connection) await connection.rollback();
        console.log(err);
        return false
    } finally {
        if (connection) connection.release();
    }
}

async function update(id, formData) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [data] = await connection.query(`UPDATE categories SET 
                                                CategoryName = '${formData.CategoryName}',
                                                LogoPath = '${formData.LogoPath}',
                                                IsExpense = ${formData.IsExpense},
                                                IsIncome = ${formData.IsIncome},
                                                Description = '${formData.Description}',
                                                UserID = ${formData.UserID},
                                                Modified = NOW(),
                                                IsActive = ${formData.IsActive},
                                                Sequence = ${formData.Sequence}
                                                WHERE CategoryID = ${id};
                                                `)

        // Handle subcategories
        if (formData.subcategories && Array.isArray(formData.subcategories)) {
            // Get existing subcategories to know what to keep/delete
            const [existingSubs] = await connection.query(`SELECT SubCategoryID FROM sub_categories WHERE CategoryID = ${id}`);
            const existingIds = existingSubs.map(s => s.SubCategoryID);

            const incomingIds = [];

            for (const sub of formData.subcategories) {
                // If it's a string, it's a new one (legacy behavior from frontend currently)
                // If it's an object, check if it has ID
                if (typeof sub === 'string') {
                    // It's a new one, insert it
                    await connection.query(`INSERT INTO sub_categories
                        (SubCategoryID, CategoryID, SubCategoryName, LogoPath, IsExpense, IsIncome, IsActive, Description, UserID, Created, Modified, Sequence)
                        VALUES
                        (NULL, ${id}, '${sub}', '', ${formData.IsExpense}, ${formData.IsIncome}, 1, '', ${formData.UserID}, NOW(), NOW(), 0)
                    `);
                } else if (typeof sub === 'object') {
                    if (sub.SubCategoryID) {
                        // Update existing (mostly name)
                        incomingIds.push(sub.SubCategoryID);
                        await connection.query(`UPDATE sub_categories SET
                           SubCategoryName = '${sub.SubCategoryName}'
                           WHERE SubCategoryID = ${sub.SubCategoryID}
                       `);
                    } else if (sub.SubCategoryName) {
                        // New one
                        await connection.query(`INSERT INTO sub_categories
                        (SubCategoryID, CategoryID, SubCategoryName, LogoPath, IsExpense, IsIncome, IsActive, Description, UserID, Created, Modified, Sequence)
                        VALUES
                        (NULL, ${id}, '${sub.SubCategoryName}', '', ${formData.IsExpense}, ${formData.IsIncome}, 1, '', ${formData.UserID}, NOW(), NOW(), 0)
                    `);
                    }
                }
            }

            // Delete removed ones
            // Only if we are receiving objects with IDs. If receiving strings we might just be appending? 
            // The frontend "update" replaces the list. So any ID not in incomingIds should be deleted.
            // CAUTION: If the frontend sends strings for everything, safe to assume we can't identify existing ones to keep?
            // No, the frontend currently sends strings. If I change frontend to send objects, this logic holds.

            if (incomingIds.length > 0) {
                const toDelete = existingIds.filter(eid => !incomingIds.includes(eid));
                if (toDelete.length > 0) {
                    // Verify if used in expenses/incomes? 
                    // For now, let's try delete. If FK constraints exist, it will fail, which is good.
                    try {
                        await connection.query(`DELETE FROM sub_categories WHERE SubCategoryID IN (${toDelete.join(',')})`);
                    } catch (e) {
                        console.warn("Could not delete some subcategories, probably in use.", e);
                    }
                }
            }
        }

        await connection.commit();
        return data;
    }
    catch (err) {
        if (connection) await connection.rollback();
        console.log(err);
        return false
    } finally {
        if (connection) connection.release();
    }
}

async function deleteById(id) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Check if used in expenses
        const [expenses] = await connection.query(`SELECT ExpenseID FROM expenses WHERE CategoryID = ${id} LIMIT 1`);
        if (expenses.length > 0) {
            throw new Error("Cannot delete category as it is being used in expenses.");
        }

        // 2. Check if used in incomes
        const [incomes] = await connection.query(`SELECT IncomeID FROM incomes WHERE CategoryID = ${id} LIMIT 1`);
        if (incomes.length > 0) {
            throw new Error("Cannot delete category as it is being used in incomes.");
        }

        // 3. Delete subcategories first
        await connection.query(`DELETE FROM sub_categories WHERE CategoryID = ${id}`);

        // 4. Delete the category
        const [result] = await connection.query(`DELETE FROM categories WHERE CategoryID = ${id}`);
        
        await connection.commit();
        return result;
    }
    catch (err) {
        if (connection) await connection.rollback();
        console.error("Error deleting category:", err.message);
        return false;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { getAll, getById, insert, deleteById, update }