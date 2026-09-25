const express = require("express");
const { getAllExpenses, getExpenseByID, insertExpenses, updateExpenses, deleteExpenses } = require("../services/expenses.service");

const expensesRouter = express.Router();

expensesRouter.get("/", async (req, res) => {
    const data = await getAllExpenses(req.query.userId);
    res.send(data);
});

expensesRouter.get("/:id", async (req, res) => {
    const data = await getExpenseByID(req.params.id);
    res.send(data);
});

expensesRouter.post("/", async (req, res) => {
    const data = await insertExpenses(req.body);
    res.send(data);
});

expensesRouter.patch("/:id", async (req, res) => {
    const data = await updateExpenses(req.params.id, req.body);
    res.send(data);
});

expensesRouter.delete("/:id", async (req, res) => {
    const data = await deleteExpenses(req.params.id);
    res.send(data);
});

module.exports = expensesRouter;
