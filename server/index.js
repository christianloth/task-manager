// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const userRouter = require("./src/routes/users.routes");
const taskRouter = require("./src/routes/task.routes");
const groupRouter = require("./src/routes/group.routes");
const group_listRouter = require("./src/routes/group_member.routes");
const eventRouter = require("./src/routes/event.routes");
const categoryRouter = require("./src/routes/category.routes");
const category_listRouter = require("./src/routes/category_member.routes");
const adminRouter = require("./src/routes/admin.routes");

const MainDB = require("./src/api/db");
const DBO = MainDB;

// DBO.db.all("SELECT * FROM contacts", (error, rows) => {
//     console.log(error, rows);
// });

// Setting CORS to allow all connection
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/group", groupRouter);
app.use("/api/group_member", group_listRouter);
app.use("/api/event", eventRouter);
app.use("/api/category", categoryRouter);
app.use("/api/category_member", category_listRouter);
app.use("/api/admin", adminRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });

    return;
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
