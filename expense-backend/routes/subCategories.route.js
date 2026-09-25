const express = require("express");
const {getAllSubCategories,getSubCategoryByID,insertSubCategories,updateSubCategories,deleteSubCategories} = require("../services/subCategories.service");

const subCategoriesRouter = express.Router();

subCategoriesRouter.get("/", async (req, res) => {
    const data = await getAllSubCategories();
    res.send(data);
});

subCategoriesRouter.get("/:id", async (req, res) => {
    const data = await getSubCategoryByID(req.params.id);
    res.send(data);
});

subCategoriesRouter.post("/", async (req, res) => {
    const data = await insertSubCategories(req.body);
    res.send(data);
});

subCategoriesRouter.patch("/:id", async (req, res) => {
    const data = await updateSubCategories(req.params.id, req.body);
    res.send(data);
});

subCategoriesRouter.delete("/:id", async (req, res) => {
    const data = await deleteSubCategories(req.params.id);
    res.send(data);
});

module.exports = subCategoriesRouter;
