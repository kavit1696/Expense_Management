const express = require("express")
const { getAllPeoples, getPeopleByID, insertPeoples, updatePeoples, deletePeoples } = require("../services/peoples.service")

const peoplesRouter = express.Router()

peoplesRouter.get("/", async (req, res) => {
    data = await getAllPeoples(req.query.userId)
    res.send(data)
})

peoplesRouter.get("/:id", async (req, res) => {
    data = await getPeopleByID(req.params.id)
    res.send(data)
})

peoplesRouter.post("/", async (req, res) => {
    data = await insertPeoples(req.body)
    res.send(data)
})

peoplesRouter.patch("/:id", async (req, res) => {
    data = await updatePeoples(req.params.id, req.body)
    res.send(data)
})

peoplesRouter.delete("/:id", async (req, res) => {
    data = await deletePeoples(req.params.id)
    res.send(data)
})
module.exports = peoplesRouter