const express = require("express");
const router = express.Router();

const MainDB = require("../api/db");

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

router.delete("/:task_id", (req, res) => {
    // write code to query
    const {task_id} = req.params;
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
module.exports = router;
