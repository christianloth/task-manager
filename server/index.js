// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const apiRouter = require("./src/routes/api.routes");

const MainDB = require('./src/api/db')
const DBO = MainDB

DBO.db.all('SELECT * FROM contacts', (error, rows) => {
    console.log(error, rows)
})

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

app.use("/api", apiRouter);

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
