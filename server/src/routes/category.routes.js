// Created by Yijin and Reo

const express = require("express");
const router = express.Router();
const MainDB = require("../api/db.js");

router.get("/", (req, res) => {
    MainDB.db.all("SELECT * FROM category", (err, rows) => {
        if (err) return err;

        res.json({
            rows,
        });
    });
});
//Create By Yijin
//get group name, category name, task name and username base on category id
router.get("/:category_id", async (req, res) => {
    try {
        const rows = await MainDB.db.query(
            `SELECT groups.group_name, category.category_name, users.username, task.task_name
            FROM groups, users, task INNER JOIN category ON 
            (task.category_id = ${req.params.category_id} AND category.group_id = groups.group_id AND groups.user_id = users.user_id)`
        );
        res.json(rows);
    } catch (e) {
        res.status(400).send(e);
    }
});

//Created by Yijin
//update category name and description
router.put("/:category_id", async (req, res) => {
    const {descriptions, category_name, category_id} = req.body;
    const sql = `UPDATE category Set category_name = '${category_name}',descriptions = '${descriptions}'  where category_id = ${category_id}`;
    MainDB.db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(`category name and description for category ${category_id} has been update!`);
    });
    res.send(sql);
});
router.post("/create", (req, res) => {
    const { category_id, group_id, category_name, descriptions, create_date } =
        req.body;
    const sql = `INSERT INTO category (category_id ,group_id, category_name,descriptions,create_date)
VALUES ("${category_id}","${group_id}", "${category_name}","${descriptions}", "${create_date}")`;
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
router.delete("/:category_id", (req, res) => {
    const { category_id } = req.params;
    const sql = `DELETE FROM category WHERE category_id = "${category_id}"`;
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
