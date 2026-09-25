const express = require("express");
const { getAllIncomes, getIncomeByID, insertIncomes, updateIncomes, deleteIncomes } = require("../services/incomes.service");

const incomesRouter = express.Router();

incomesRouter.get("/", async (req, res) => {
    const data = await getAllIncomes(req.query.userId);
    res.send(data);
});

incomesRouter.get("/:id", async (req, res) => {
    const data = await getIncomeByID(req.params.id);
    res.send(data);
});

incomesRouter.post("/", async (req, res) => {
    const data = await insertIncomes(req.body);
    res.send(data);
});

incomesRouter.patch("/:id", async (req, res) => {
    const data = await updateIncomes(req.params.id, req.body);
    res.send(data);
});

incomesRouter.delete("/:id", async (req, res) => {
    const data = await deleteIncomes(req.params.id);
    res.send(data);
});

module.exports = incomesRouter;
