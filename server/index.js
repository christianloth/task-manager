// server/index.js
// Created By: Reo Matsuda

const express = require("express");
const sqlite3 = require("sqlite3");
const session = require('express-session');

const PORT = process.env.PORT || 3001;

const app = express();
const userRouter = require("./src/routes/users.routes");
// const taskRouter = require("./src/routes/task.routes");
const groupRouter = require("./src/routes/group.routes");
// const group_listRouter = require("./src/routes/group_member.routes");
// const eventRouter = require("./src/routes/event.routes");
// const categoryRouter = require("./src/routes/category.routes");
// const category_listRouter = require("./src/routes/category_member.routes");
// const adminRouter = require("./src/routes/admin.routes");

const { dirname } = require("path");
const appDir = dirname(require.main.filename);
const dbFilePath = appDir + "/src/db/test.db";

const MainDB = require("./src/api/db.js");
const DBO = MainDB;

// Create a new DB
const createNewDB = () => {
    return new Promise((resolve, reject) => {
        MainDB.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                reject(err);
            } else {
                MainDB.db.query = function (sql, params) {
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        that.all(sql, params, function (error, rows) {
                            if (error) reject(error);
                            else resolve({ rows: rows });
                        });
                    });
                };

                resolve("Connected to database");
            }
        });
    });
};

// Initialize + seed DB
const initDB = async () => {
    await createNewDB();
    await DBO.initDB();
    await DBO.seedDB();
};
// Uncomment line below if you want to reset DB
// initDB();

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

//Session Used to Store Loggin Information (Written By: Quentin Romanoski)
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
// Written By: Yijin Fang, Quentin Romanoski
app.use("/api/users", userRouter);
// app.use("/api/task", taskRouter);
app.use("/api/group", groupRouter);
// app.use("/api/group_member", group_listRouter);
// app.use("/api/event", eventRouter);
// app.use("/api/category", categoryRouter);
// app.use("/api/category_member", category_listRouter);
// app.use("/api/admin", adminRouter);

//Login: Authentication and Setting Session (Written by: Quentin Romanoski)
app.post('/api/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
        query = `SELECT user_id FROM users where username="${username}" AND pass_word="${password}"`
        answer =  MainDB.db.query(query).then(data => {
            if(data){
                user_id = data["rows"][0]["user_id"];
                // Authenticate the user
                req.session.loggedin = true;
                req.session.userId = user_id;
                // Redirect to home page
                res.send("Successfully Logged In!!");
            }else{
                res.send('Incorrect Username and/or Password!');
            }
        });
	} else {
		res.send('Please enter Username and Password!');
	}
});

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
