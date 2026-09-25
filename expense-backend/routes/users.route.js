const express = require("express");
const { getAllUsers, getUserByID, insertUsers, updateUsers, deleteUsers, login } = require("../services/users.service");

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
    const data = await getAllUsers();
    res.send(data);
});

usersRouter.get("/:id", async (req, res) => {
    const data = await getUserByID(req.params.id);
    res.send(data);
});

usersRouter.post("/", async (req, res) => {
    const data = await insertUsers(req.body);
    res.send(data);
});

usersRouter.post("/login", async (req, res) => {
    const data = await login(req.body);
    res.send(data);
});

usersRouter.patch("/:id", async (req, res) => {
    const data = await updateUsers(req.params.id, req.body);
    res.send(data);
});

usersRouter.delete("/:id", async (req, res) => {
    const data = await deleteUsers(req.params.id);
    res.send(data);
});

module.exports = usersRouter
