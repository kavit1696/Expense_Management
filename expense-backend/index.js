require("dotenv").config();
const express = require("express");
const cors = require("cors");
const peoplesRouter = require("./routes/peoples.route");
const categoriesRouter = require("./routes/categories.route");
const projectsRouter = require("./routes/projects.route");
const expensesRouter = require("./routes/expenses.route");
const subCategoriesRouter = require("./routes/subCategories.route");
const incomesRouter = require("./routes/incomes.route");
const usersRouter = require("./routes/users.route");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
    res.json({ status: "API Working", timestamp: new Date().toISOString() });
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/peoples", peoplesRouter);
app.use("/categories", categoriesRouter);
app.use("/projects", projectsRouter);
app.use("/expenses", expensesRouter);
app.use("/subCategories", subCategoriesRouter);
app.use("/incomes", incomesRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});