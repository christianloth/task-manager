// Created by Yijin and Reo

const express = require("express");
const router = express.Router();

const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM category_member", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});

//Create by Yijin 
//Get username base on the category_id
router.get("/:category_id", async (req, res) => {
    try {
        const rows = await MainDB.db.query(
            `SELECT users.username
            FROM users INNER JOIN category_member ON (category_member.user_id = users.user_id AND category_member.category_id = ${req.params.category_id})`
        );
        res.json(rows);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.post("/create", (req, res) => {
    const { categorylist_id, user_id, category_id } = req.body;
    const sql = `INSERT INTO category_member (categorylist_id ,user_id, category_id)
VALUES ("${categorylist_id}","${user_id}", "${category_id}")`;
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
router.delete("/:categorylist_id", (req, res) => {
    // write code to query
    const { categorylist_id } = req.params;
    const sql = `DELETE FROM category_member WHERE categorylist_id = "${categorylist_id}"`;
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
