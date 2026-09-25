const express = require("express")
const { getAllProjects, getProjectByID, insertProjects, updateProjects, deleteProjects } = require("../services/projects.service")

const projectsRouter = express.Router()

projectsRouter.get("/", async (req, res) => {
    data = await getAllProjects(req.query.userId)
    res.send(data)
})

projectsRouter.get("/:id", async (req, res) => {
    data = await getProjectByID(req.params.id)
    res.send(data)
})

projectsRouter.post("/", async (req, res) => {
    data = await insertProjects(req.body)
    res.send(data)
})

projectsRouter.patch("/:id", async (req, res) => {
    data = await updateProjects(req.params.id, req.body)
    res.send(data)
})

projectsRouter.delete("/:id", async (req, res) => {
    data = await deleteProjects(req.params.id)
    res.send(data)
})
module.exports = projectsRouter