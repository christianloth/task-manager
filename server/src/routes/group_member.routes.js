// Created by Yijin and Reo

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM group_member_list", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
//Create by Reo and Yijin
//User in the same group will be list
router.get("/:group_id", async (req, res) => {
    try {
        const rows = await MainDB.db.query(
            `SELECT users.username
            FROM users INNER JOIN group_member_list ON (group_member_list.user_id = users.user_id AND group_member_list.group_id = ${req.params.group_id})`
        );
        res.json(rows);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/create", (req, res) => {
    const { group_member_list_id, group_id, user_id } = req.body;
    const sql = `INSERT INTO group_member_list (group_member_list_id ,group_id, user_id)
VALUES ("${group_member_list_id}","${group_id}", "${user_id}")`;
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
router.delete("/:user_id", (req, res) => {
    const { user_id } = req.params;
    const sql = `DELETE FROM group_member_list WHERE user_id = "${user_id}"`;
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
