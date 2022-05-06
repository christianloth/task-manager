const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");
const { route } = require("./users.routes.js");

// Run server and try to go to http://localhost:3001/api/
router.get("/", (req, res) => {
    // write code to query
    MainDB.db.all("SELECT * FROM task", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});

//create by Yijin
//get username, group name category name and task name base on the task_id
router.get("/:task_id", async (req, res) => {
    try {
        const rows = await MainDB.db.query(
            `SELECT users.username, groups.group_name, category.category_name, task.task_name, task.descriptions, task.complete
            FROM users, category, groups INNER JOIN task ON 
            (users.user_id = task.user_id AND task.category_id = category.category_id AND task.task_id = ${req.params.task_id} AND groups.group_id = category.group_id)`
        );
        res.json(rows);
    } catch (e) {
        res.status(400).send(e);
    }
});
//create by Yijin
//update base on the task_id
router.put("/:task_id", async (req, res) => {
    const { descriptions, task_id, task_name } = req.body;
    const sql = `UPDATE task Set task_name = '${task_name}',descriptions = '${descriptions}'  where task_id = ${task_id}`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(
            `task name and description for task ${task_id} has been update!`
        );
    });
    res.send(sql);
});

// create by Yijin and Reo
router.post("/create", (req, res) => {
    const { task_id, user_id, category_id, task_name, descriptions } = req.body;
    const sql = `INSERT INTO task (task_id, user_id, category_id, task_name, descriptions)
VALUES ("${task_id}", "${user_id}", "${category_id}", "${task_name}", "${descriptions}")`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted!`);
    });
    res.send(sql);
});
// create by Yijin
router.delete("/:task_id", (req, res) => {
    // write code to query
    const { task_id } = req.params;
    const sql = `DELETE FROM task WHERE task_id = "${task_id}"`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been deleted!`);
    });
    res.send(sql);
});

// Set complete for task
// Written By: Reo Matsuda
router.post("/set/:task_id", async (req, res) => {
    const { task_id } = req.params;
    const { complete } = req.body;
    const sql = `UPDATE task SET complete = ${complete} WHERE task_id = ${task_id};`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(
            `task name and description for task ${task_id} has been updated with complete = ${complete}!`
        );
    });
    res.send(sql);
});
module.exports = router;
