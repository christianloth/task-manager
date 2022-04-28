// Created by Yijin and Reo

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM groups", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});

router.post("/create", (req, res) => {
    const { group_id, user_id, group_name, description } = req.body;
    const sql = `INSERT INTO group (group_id, user_id, group_name, description)
VALUES ("${group_id}", "${user_id}", "${group_name}", "${description}")`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted!`);
    });
    res.send(sql);
});

// Created by Yijin
router.delete("/:group_id", (req, res) => {
    const { group_id } = req.params;
    const sql = `DELETE FROM groups WHERE group_id = "${group_id}"`;
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
