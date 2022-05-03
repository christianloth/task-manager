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
//Create by Yijin
//get usernamae group_name category_name and event_name base on the group_id
router.get("/:group_id", async (req, res) => {
    try {
        const rows = await MainDB.db.query(
            `SELECT users.username, groups.group_name, groups.descriptions, category.category_name, events.event_name 
            FROM users, events, category INNER JOIN groups ON (groups.user_id = users.user_id 
            AND events.group_id = ${req.params.group_id} AND category.group_id = ${req.params.group_id}) `
        );
        res.json(rows);
    } catch (e) {
        res.status(400).send(e);
    }
});

//Created by Yijin
//update group name and description
router.put("/:group_id", async (req, res) => {
    const {descriptions, group_name, group_id} = req.body;
    const sql = `UPDATE groups Set group_name = '${group_name}',descriptions = '${descriptions}'  where group_id = ${group_id}`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(`group name and description for group ${group_id} has been update!`);
    });
    res.send(sql);
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
