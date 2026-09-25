const express = require("express")
const { getAllCategories, getCategoryByID, insertCategories, updateCategories, deleteCategories } = require("../services/categories.service")

const categoriesRouter = express.Router()

categoriesRouter.get("/", async (req, res) => {
    data = await getAllCategories(req.query.userId)
    res.send(data)
})

categoriesRouter.get("/:id", async (req, res) => {
    data = await getCategoryByID(req.params.id)
    res.send(data)
})

categoriesRouter.post("/", async (req, res) => {
    data = await insertCategories(req.body)
    res.send(data)
})

categoriesRouter.patch("/:id", async (req, res) => {
    data = await updateCategories(req.params.id, req.body)
    res.send(data)
})

categoriesRouter.delete("/:id", async (req, res) => {
    data = await deleteCategories(req.params.id)
    res.send(data)
})
module.exports = categoriesRouter